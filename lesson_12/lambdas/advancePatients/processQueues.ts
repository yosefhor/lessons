import { ddbDocClient } from "../../shared/dynamoClient";
import { GetCommand, QueryCommand, TransactWriteCommand, } from "@aws-sdk/lib-dynamodb";
import { QueueName, QueueNamesList } from "../../shared/queues";
import { randomTreatmentDuration, now, getPatient, createQueueInsertItem, formatPriorityAndTime } from "../../shared/utils";

// פונקציה שמריצה מעבר על כל התורים
export async function processQueues() {
    for (const queueName of QueueNamesList) {
        // שליפת הפציינט שנמצא כרגע בטיפול (אם קיים)
        const { Item: activeItem = undefined } = await ddbDocClient.send(
            new GetCommand({
                TableName: "Queues",
                Key: {
                    QueueName: queueName,
                    PriorityAndTime: "00#0000000000000",
                },
            })
        );

        if (activeItem) {
            const activePatient = await getPatient(activeItem.PatientId);
            if (
                activePatient?.TreatmentEndTime &&
                now() < activePatient.TreatmentEndTime
            ) {
                // עדיין בטיפול, לא מקדמים
                continue;
            } else {
                // סיים טיפול – מחיקת רשומת התור
                await ddbDocClient.send(
                    new TransactWriteCommand({
                        TransactItems: [
                            {
                                Delete: {
                                    TableName: "Queues",
                                    Key: {
                                        QueueName: queueName,
                                        PriorityAndTime: "00#0000000000000",
                                    },
                                },
                            },
                            {
                                Update: {
                                    TableName: "Patients",
                                    Key: { PatientId: activePatient?.PatientId },
                                    UpdateExpression: `
                    REMOVE CurrentTreatment, TreatmentStartTime, TreatmentDuration, TreatmentEndTime
                  `,
                                },
                            },
                        ],
                    })
                );
            }
        }

        // כעת נשלוף את 10 הממתינים בתור לפי סדר עדיפות
        const { Items: queueItems = [] } = await ddbDocClient.send(
            new QueryCommand({
                TableName: "Queues",
                KeyConditionExpression: "QueueName = :queueName",
                ExpressionAttributeValues: {
                    ":queueName": queueName,
                },
                ScanIndexForward: true,
                Limit: 10,
            })
        );

        if (queueItems.length === 0) continue;

        // מישהו זמין – בודקים מי הממתין הראשון שאינו באמצע טיפול אחר
        for (const item of queueItems) {
            const patient = await getPatient(item.PatientId);
            if (!patient) continue;

            if (
                patient.TreatmentEndTime &&
                now() < patient.TreatmentEndTime
            ) {
                // באמצע טיפול אחר, מדלגים
                continue;
            }

            const newWaitingQueues = [...patient.WaitingQueues];
            newWaitingQueues[0] = newWaitingQueues[0].filter((q) => q !== queueName);

            const nextStep: QueueName[] = [];

            if (newWaitingQueues[0].length === 0) {
                newWaitingQueues.shift();
                nextStep.push(...newWaitingQueues[0]);
            }

            const treatmentStartTime = now();
            const treatmentDuration = randomTreatmentDuration();
            const treatmentEndTime = treatmentStartTime + treatmentDuration;

            const transactItems: any[] = [
                {
                    Update: {
                        TableName: "Patients",
                        Key: { PatientId: patient.PatientId },
                        UpdateExpression: `
              SET TreatmentStartTime = :start,
              TreatmentDuration = :duration,
              TreatmentEndTime = :end,
                  CurrentTreatment = :queue,
                  WaitingQueues = :queues
            `,
                        ExpressionAttributeValues: {
                            ":start": treatmentStartTime,
                            ":duration": treatmentDuration,
                            ":end": treatmentEndTime,
                            ":queue": queueName,
                            ":queues": newWaitingQueues,
                        },
                    },
                },
                {
                    Delete: {
                        TableName: "Queues",
                        Key: {
                            QueueName: queueName,
                            PriorityAndTime: item.PriorityAndTime,
                        },
                    },
                },
                {
                    Put: {
                        TableName: "Queues",
                        Item: {
                            QueueName: queueName,
                            PriorityAndTime: "00#0000000000000",
                            PatientId: patient.PatientId,
                        },
                    },
                }
            ];

            for (const q of nextStep) {
                transactItems.push(
                    createQueueInsertItem(q, patient.PatientId, patient.Priority)
                );
            }

            await ddbDocClient.send(
                new TransactWriteCommand({ TransactItems: transactItems })
            );

            break;
        }
    }
}
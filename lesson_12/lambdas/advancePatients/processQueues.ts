import { ddbDocClient } from "../../shared/dynamoClient";
import { GetCommand, QueryCommand, TransactWriteCommand, } from "@aws-sdk/lib-dynamodb";
import { Patient } from "../../shared/types";
import { QueueName, QueueNamesList } from "../../shared/queues";
import { formatPriorityAndTime, randomTreatmentDuration, now } from "../../shared/utils";

// פונקציה שמריצה מעבר על כל התורים
export async function processQueues() {

    for (const queueName of QueueNamesList) {

        // שליפת הממתינים לתור מהטבלה לפי הסדר (Limit של 10 מספיק כרגע)
        const { Items: queueItems = [] } = await ddbDocClient.send(
            new QueryCommand({
                TableName: "Queues",
                KeyConditionExpression: "QueueName = :queueName",
                ExpressionAttributeValues: {
                    ":queueName": queueName,
                },
                ScanIndexForward: true, // ממי שצריך להיכנס ראשון
                Limit: 10,
            })
        );

        if (queueItems.length === 0) continue;

        // בדיקה אם מישהו כבר בטיפול בתור הזה
        let someoneInTreatment = false;
        for (const item of queueItems) {
            const patient = await getPatient(item.PatientId);
            if (
                patient &&
                patient.CurrentTreatment === queueName &&
                patient.TreatmentStartTime &&
                patient.TreatmentDuration &&
                now() < patient.TreatmentStartTime + patient.TreatmentDuration
            ) {
                someoneInTreatment = true;
                break;
            }
        }

        if (someoneInTreatment) continue;

        // מישהו זמין – נמצא את הראשון שזמין
        for (const item of queueItems) {
            const patient = await getPatient(item.PatientId);
            if (!patient || patient.CurrentTreatment !== null) continue;

            const currentStep = patient.WaitingQueues[0];
            const updatedStep = currentStep.filter(q => q !== queueName);

            const newWaitingQueues = [...patient.WaitingQueues];
            let newStepQueues: QueueName[] = [];

            if (updatedStep.length === 0) {
                // סיימנו את השלב הנוכחי, מסירים אותו
                newWaitingQueues.shift();

                // אם יש שלב הבא – נוסיף את התורים שבו ל־Queues
                if (newWaitingQueues.length > 0) {
                    newStepQueues = newWaitingQueues[0]; // אלו התורים החדשים שצריך להכניס ל־Queues
                }
            } else {
                newWaitingQueues[0] = updatedStep; // רק מסירים את התור שבוצע מהשלב הנוכחי
            }

            const treatmentDuration = randomTreatmentDuration();
            const transactItems: any[] = [
                {
                    Update: {
                        TableName: "Patients",
                        Key: { PatientId: patient.PatientId },
                        UpdateExpression: `
        SET TreatmentStartTime = :start,
            TreatmentDuration = :duration,
            CurrentTreatment = :queue,
            WaitingQueues = :newWaitingQueues
      `,
                        ExpressionAttributeValues: {
                            ":start": now(),
                            ":duration": treatmentDuration,
                            ":queue": queueName,
                            ":newWaitingQueues": newWaitingQueues,
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
            ];

            for (const q of newStepQueues) {
                const priorityKey = formatPriorityAndTime(patient.Priority, now());
                transactItems.push({
                    Put: {
                        TableName: "Queues",
                        Item: {
                            QueueName: q,
                            PriorityAndTime: priorityKey,
                            PatientId: patient.PatientId,
                        },
                    },
                });
            }

            await ddbDocClient.send(new TransactWriteCommand({
                TransactItems: transactItems,
            }));

            break; // קידמנו מישהו → יוצאים מהלולאה
        }
    }
}

// פונקציה עזר לשליפת פציינט מהטבלה
async function getPatient(PatientId: string): Promise<Patient | null> {
    const res = await ddbDocClient.send(
        new GetCommand({
            TableName: "Patients",
            Key: { PatientId },
        })
    );
    return res.Item as Patient;
}

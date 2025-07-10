import { ddbDocClient } from "./lib/dynamoClient";
import {
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Patient } from "./types";
import { QueueNamesList } from "./queues";

export async function processQueues() {
  for (const queueName of QueueNamesList) {
    const now = Date.now();

    // שליפת כל הממתינים בתור הזה (Limit של 10 מספיק לרוב)
    const { Items: queueItems = [] } = await ddbDocClient.send(
      new QueryCommand({
        TableName: "Queues",
        KeyConditionExpression: "QueueName = :queueName",
        ExpressionAttributeValues: {
          ":queueName": queueName,
        },
        ScanIndexForward: true, // מהנמוך לגבוה (עדיפות גבוהה יותר)
        Limit: 10,
      })
    );

    if (queueItems.length === 0) continue;

    // בדיקה אם מישהו כבר בטיפול כרגע בתור הזה
    let someoneInTreatment = false;

    for (const item of queueItems) {
      const patient = await getPatient(item.PatientId);
      if (!patient) continue;

      if (
        patient.CurrentTreatments !== null &&
        patient.TreatmentStartTime &&
        patient.TreatmentDuration &&
        now < patient.TreatmentStartTime + patient.TreatmentDuration
      ) {
        someoneInTreatment = true;
        break;
      }
    }

    if (someoneInTreatment) continue;

    // מישהו כבר לא בטיפול – ננסה לקדם את הראשון שזמין
    for (const item of queueItems) {
      const patient = await getPatient(item.PatientId);
      if (!patient || patient.CurrentTreatments.length > 0) continue;

      // עדכון - הכנסת המטופל לטיפול
      const updateParams = new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              TableName: "Patients",
              Key: { PatientId: patient.PatientId },
              UpdateExpression:
                "SET TreatmentStartTime = :start, TreatmentDuration = :duration, CurrentTreatments = list_append(if_not_exists(CurrentTreatments, :emptyList), :treat), CurrentQueues = list_remove(CurrentQueues, :index)",
              ExpressionAttributeValues: {
                ":start": now,
                ":duration": 1000 * 60 * 5, // לדוגמה, 5 דקות טיפול
                ":treat": [queueName],
                ":emptyList": [],
                ":index": patient.CurrentQueues.indexOf(queueName),
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
        ],
      });

      await ddbDocClient.send(updateParams);
      break; // עצרנו אחרי שמצאנו מישהו לקדם
    }
  }
}

async function getPatient(PatientId: string): Promise<Patient | null> {
  const res = await ddbDocClient.get({
    TableName: "Patients",
    Key: { PatientId },
  });
  return res.Item as Patient;
}

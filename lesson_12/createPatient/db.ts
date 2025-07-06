import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Patient } from "./types";

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "PatientsQueue";

export async function insertPatient(patient: Patient) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PatientId: { S: patient.PatientId },
      Priority: { N: patient.Priority.toString() },
      CurrentQueues: { SS: patient.CurrentQueues }, // רשימה של מחרוזות
      CurrentTreatments: { SS: patient.CurrentTreatments },
      NextQueues: { S: JSON.stringify(patient.NextQueues) }, // מאחר שזה מערך דו-ממדי
      Status: { S: patient.Status },
      WaitStartTimes: { S: JSON.stringify(patient.WaitStartTimes) },
      WaitDurations: { S: JSON.stringify(patient.WaitDurations) },
      TreatmentStartTimes: { S: JSON.stringify(patient.TreatmentStartTimes) },
      TreatmentDurations: { S: JSON.stringify(patient.TreatmentDurations) },
    },
  };
  await client.send(new PutItemCommand(params));
}

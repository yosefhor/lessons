import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { now, randomMinutesToMs } from "./utils";
import { Patient } from "./types";

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "PatientsQueue";

async function getAllPatients(): Promise<Patient[]> {
  const data = await client.send(new ScanCommand({ TableName: TABLE_NAME }));
  // המרה ל-Patient מתוך data.Items - לדוגמה בלבד, צריך להוסיף קידוד נכון
  return data.Items?.map((item) => {
    // כאן יש לעשות המרה מ-DynamoDB Item ל-Patient (לא מפורט כאן)
    return item as unknown as Patient;
  }) || [];
}

function isWaitingTimeOver(patient: Patient, queue: string): boolean {
  const nowTs = now();
  return nowTs - patient.WaitStartTimes[queue] >= patient.WaitDurations[queue];
}

function isTreatmentTimeOver(patient: Patient, queue: string): boolean {
  const nowTs = now();
  return nowTs - patient.TreatmentStartTimes[queue] >= patient.TreatmentDurations[queue];
}

async function advancePatient(patient: Patient) {
  // בדיקת המתנה לכל תור ב-CurrentQueues
  for (const queue of patient.CurrentQueues) {
    if (isWaitingTimeOver(patient, queue)) {
      // התחלת טיפול
      patient.Status = "in-treatment";
      patient.CurrentTreatments.push(queue);
      patient.TreatmentStartTimes[queue] = now();
      // מסיר מהתור שממתין
      patient.CurrentQueues = patient.CurrentQueues.filter(q => q !== queue);
    }
  }

  // בדיקה אם הסתיים טיפול
  for (const queue of patient.CurrentTreatments) {
    if (isTreatmentTimeOver(patient, queue)) {
      // מסיים טיפול
      patient.CurrentTreatments = patient.CurrentTreatments.filter(q => q !== queue);

      if (patient.CurrentQueues.length === 0 && patient.CurrentTreatments.length === 0) {
        const nextStep = patient.NextQueues.shift();
        if (nextStep && nextStep.length > 0) {
          patient.CurrentQueues = [...nextStep];
          patient.Status = "waiting";
          const nowTs = now();
          for (const q of nextStep) {
            patient.WaitStartTimes[q] = nowTs;
            patient.WaitDurations[q] = randomMinutesToMs(1, 5);
            patient.TreatmentDurations[q] = randomMinutesToMs(2, 5);
            patient.TreatmentStartTimes[q] = 0;
          }
        } else {
          // סיום מלא
          patient.Status = "done";
        }
      }
    }
  }

  // שליחת עדכון ל-DynamoDB
  await client.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: { PatientId: { S: patient.PatientId } },
      UpdateExpression: "SET Status = :s, CurrentQueues = :cq, CurrentTreatments = :ct, NextQueues = :nq",
      ExpressionAttributeValues: {
        ":s": { S: patient.Status },
        ":cq": { SS: patient.CurrentQueues },
        ":ct": { SS: patient.CurrentTreatments },
        ":nq": { S: JSON.stringify(patient.NextQueues) },
      },
    })
  );
}

export async function handler(event: any) {
  const patients = await getAllPatients();
  for (const p of patients) {
    await advancePatient(p);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Queues advanced" }),
  };
}

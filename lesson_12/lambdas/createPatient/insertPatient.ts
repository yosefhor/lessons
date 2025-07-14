import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { Patient } from "../../shared/types";
import { createQueueInsertItem } from "../../shared/utils";
import { ddbDocClient } from "../../shared/dynamoClient";

export async function insertPatient(patient: Patient): Promise<void> {
  const transactItems: any[] = [];

  // הכנסת הפציינט לטבלת החולים
  transactItems.push({
    Put: {
      TableName: "Patients",
      Item: patient,
    },
  });

  // הכנסת התורים בשלב הראשון (WaitingQueues)
  for (const queue of patient.WaitingQueues[0]) {
    transactItems.push(createQueueInsertItem(queue, patient.PatientId, patient.Priority));
  }

  await ddbDocClient.send(
    new TransactWriteCommand({
      TransactItems: transactItems,
    })
  );
}

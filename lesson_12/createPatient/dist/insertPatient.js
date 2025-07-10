import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand, } from "@aws-sdk/lib-dynamodb";
import { now, formatPriorityAndTime } from "./utils";
const client = new DynamoDBClient({ region: "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(client);
const PATIENTS_TABLE = "Patients";
const QUEUES_TABLE = "Queues";
export async function insertPatient(patient) {
    const transactItems = [];
    // הכנסת הפציינט לטבלה המרכזית
    transactItems.push({
        Put: {
            TableName: PATIENTS_TABLE,
            Item: patient,
        },
    });
    const currentTime = now();
    for (const queue of patient.CurrentQueues) {
        const priorityAndTime = formatPriorityAndTime(patient.Priority, currentTime);
        transactItems.push({
            Put: {
                TableName: QUEUES_TABLE,
                Item: {
                    QueueName: queue,
                    PriorityAndTime: priorityAndTime,
                    PatientId: patient.PatientId,
                },
            },
        });
    }
    await docClient.send(new TransactWriteCommand({
        TransactItems: transactItems,
    }));
}

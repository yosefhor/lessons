process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";//Dev only, do not use in production!!!

import { CreateTableCommand, CreateTableCommandInput, ProjectionType } from "@aws-sdk/client-dynamodb";
import { client } from "./lib/dynamoClient";

async function createTable(params: CreateTableCommandInput) {
  try {
    await client.send(new CreateTableCommand(params));
    console.log(`✅ Table created: ${params.TableName}`);
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log(`⚠️ Table already exists: ${params.TableName}`);
    } else {
      console.error(`❌ Failed to create table ${params.TableName}`, err);
    }
  }
}

const PatientsTable: CreateTableCommandInput = {
  TableName: "Patients",
  KeySchema: [
    { AttributeName: "PatientId", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "PatientId", AttributeType: "S" }
  ],
  BillingMode: "PAY_PER_REQUEST"
};

const QueuesTable: CreateTableCommandInput = {
  TableName: "Queues",
  KeySchema: [
    { AttributeName: "QueueName", KeyType: "HASH" },
    { AttributeName: "PriorityAndTime", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
    { AttributeName: "QueueName", AttributeType: "S" },
    { AttributeName: "PriorityAndTime", AttributeType: "S" }
  ],
  BillingMode: "PAY_PER_REQUEST"
};

createTable(PatientsTable);
createTable(QueuesTable);
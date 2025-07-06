process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";//Dev only, do not use in production!!!

import { CreateTableCommand, CreateTableCommandInput, ProjectionType } from "@aws-sdk/client-dynamodb";
import { client } from "./lib/dynamoClient.ts";

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

const PatientsQueue: CreateTableCommandInput = {
  TableName: 'PatientsQueue',
  KeySchema: [
    { AttributeName: "PatientId", KeyType: "HASH" },
  ],
  AttributeDefinitions: [
    { AttributeName: "PatientId", AttributeType: "S" },
    { AttributeName: "CurrentQueue", AttributeType: "S" },
    { AttributeName: "PriorityAndTime", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "QueuePriority_Index",
      KeySchema: [
        { AttributeName: "CurrentQueue", KeyType: "HASH" },
        { AttributeName: "PriorityAndTime", KeyType: "RANGE" }
      ],
      Projection: {
        ProjectionType: ProjectionType.KEYS_ONLY,
      }
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
}

createTable(PatientsQueue);

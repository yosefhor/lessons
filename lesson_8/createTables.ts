process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { CreateTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";
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

async function main() {
  // Projects table
  await createTable({
    TableName: "Projects",
    KeySchema: [{ AttributeName: "ProjectID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "ProjectID", AttributeType: "S" },
      { AttributeName: "Owner", AttributeType: "S" },
      { AttributeName: "CreatedAt", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "OwnerCreatedIndex",
        KeySchema: [
          { AttributeName: "Owner", KeyType: "HASH" },
          { AttributeName: "CreatedAt", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  // TaskSequences
  await createTable({
    TableName: "TaskSequences",
    KeySchema: [{ AttributeName: "SequenceID", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "SequenceID", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  // Activities
  await createTable({
    TableName: "Activities",
    KeySchema: [{ AttributeName: "ActivityID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "ActivityID", AttributeType: "S" },
      { AttributeName: "SequenceID", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "BySequence",
        KeySchema: [{ AttributeName: "SequenceID", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  // ExecutionLog
  await createTable({
    TableName: "ExecutionLog",
    KeySchema: [{ AttributeName: "LogID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "LogID", AttributeType: "S" },
      { AttributeName: "EntityID", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ByEntity",
        KeySchema: [{ AttributeName: "EntityID", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  console.log("🚀 כל הטבלאות נוצרו!");
}

main().catch(console.error);

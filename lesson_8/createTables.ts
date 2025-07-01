process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { CreateTableCommand, CreateTableCommandInput } from "@aws-sdk/client-dynamodb";
import { client } from "./src/lib/dynamoClient.ts";

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
  // Projects
  await createTable({
    TableName: "Projects",
    KeySchema: [{ AttributeName: "ProjectID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "ProjectID", AttributeType: "S" },
      { AttributeName: "Owner", AttributeType: "S" },
      { AttributeName: "Status", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ByStatus",
        KeySchema: [{ AttributeName: "Status", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
      {
        IndexName: "ByOwner",
        KeySchema: [{ AttributeName: "Owner", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  // TaskSequences
  await createTable({
    TableName: "TaskSequences",
    KeySchema: [{ AttributeName: "SequenceID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "SequenceID", AttributeType: "S" },
      { AttributeName: "ProjectID", AttributeType: "S" },
      { AttributeName: "Status", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ByStatus",
        KeySchema: [{ AttributeName: "Status", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
      {
        IndexName: "ByProject",
        KeySchema: [{ AttributeName: "ProjectID", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  // Activities
  await createTable({
    TableName: "Activities",
    KeySchema: [{ AttributeName: "ActivityID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "ActivityID", AttributeType: "S" },
      { AttributeName: "SequenceID", AttributeType: "S" },
      { AttributeName: "Status", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ByStatus",
        KeySchema: [{ AttributeName: "Status", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
      {
        IndexName: "BySequence",
        KeySchema: [{ AttributeName: "SequenceID", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  // Logs
  await createTable({
    TableName: "Logs",
    KeySchema: [{ AttributeName: "LogID", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "LogID", AttributeType: "S" },
      { AttributeName: "ProjectID", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "ByProject",
        KeySchema: [{ AttributeName: "ProjectID", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  console.log("🚀 All tables created!");
}

main().catch(console.error);

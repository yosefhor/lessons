process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { CreateTableCommand, CreateTableCommandInput, ProjectionType } from "@aws-sdk/client-dynamodb";
import { client } from "./lib/dynamoClient.ts";

async function createTable() {
  const tableName: string = "Users";
  try {
    await client.send(new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        { AttributeName: "userID", KeyType: "HASH" },
        { AttributeName: "RegistrationDate", KeyType: "RANGE" }
      ],
      AttributeDefinitions: [
        { AttributeName: "userID", AttributeType: "S" },
        { AttributeName: "RegistrationDate", AttributeType: "S" },
        { AttributeName: "Something", AttributeType: "S" },
      ],
      LocalSecondaryIndexes: [{
        IndexName: "SomethingIndex",
        KeySchema: [
          { AttributeName: "userID", KeyType: "HASH" },
          { AttributeName: "Something", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL"
        }
      }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    }));
    console.log(`✅ Table created: ${tableName}`);
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log(`⚠️ Table already exists: ${tableName}`);
    } else {
      console.error(`❌ Failed to create table ${tableName}`, err);
    }
  }
}

createTable();

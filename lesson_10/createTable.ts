process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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

const users_Params: CreateTableCommandInput = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: "userID", KeyType: "HASH" },
    { AttributeName: "RegistrationDate", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "userID", AttributeType: "S" },
    { AttributeName: "RegistrationDate", AttributeType: "S" },
  ],
  BillingMode: "PAY_PER_REQUEST",
}

const users_LSI_Params: CreateTableCommandInput = {
  TableName: 'users_LSI',
  KeySchema: [
    { AttributeName: "userID", KeyType: "HASH" },
    { AttributeName: "RegistrationDate", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "userID", AttributeType: "S" },
    { AttributeName: "RegistrationDate", AttributeType: "S" },
    { AttributeName: "additionalAttribute", AttributeType: "S" }
  ],
  BillingMode: "PAY_PER_REQUEST",
  LocalSecondaryIndexes: [
    {
      IndexName: "userID_additionalAttribute_index",
      KeySchema: [
        { AttributeName: "userID", KeyType: "HASH" },
        { AttributeName: "additionalAttribute", KeyType: "RANGE" }
      ],
      Projection: {
        ProjectionType: ProjectionType.ALL
      }
    }
  ]
}

const users_GSI_Params: CreateTableCommandInput = {
  TableName: 'users_GSI',
  KeySchema: [
    { AttributeName: "userID", KeyType: "HASH" },
    { AttributeName: "RegistrationDate", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "userID", AttributeType: "S" },
    { AttributeName: "RegistrationDate", AttributeType: "S" },
    { AttributeName: "additionalAttribute", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "RegistrationDate_index",
      KeySchema: [
        { AttributeName: "RegistrationDate", KeyType: "HASH" },
      ],
      Projection: {
        ProjectionType: ProjectionType.ALL
      }
    },
    {
      IndexName: "userID_additionalAttribute_index",
      KeySchema: [
        { AttributeName: "userID", KeyType: "HASH" },
        { AttributeName: "additionalAttribute", KeyType: "RANGE" }
      ],
      Projection: {
        ProjectionType: ProjectionType.ALL
      }
    }
  ],
  BillingMode: "PAY_PER_REQUEST",
}

createTable(users_Params);

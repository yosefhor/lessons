import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const client = new DynamoDBClient({ region: "eu-central-1", });
export const ddbDocClient = DynamoDBDocumentClient.from(client);

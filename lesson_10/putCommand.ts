process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

async function createTable() {
    try {
        await client.send(new PutCommand({
            TableName: "Users",
            Item: {
                userID: "U001",
                RegistrationDate: new Date().toISOString(),
            }
        }));
        console.log(`✅ created`);
    } catch (err: any) {
        if (err.name === "ResourceInUseException") {
            console.log(`⚠️ already exists:`);
        } else {
            console.error(`❌ Failed to create`, err);
        }
    }
}

createTable();
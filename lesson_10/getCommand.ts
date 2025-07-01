process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

async function createTable() {
    try {
        const response = await client.send(new GetCommand({
            TableName: "Users",
            Key: {
                userID: "U001",
                RegistrationDate: "2025-07-01T19:17:32.599Z",
            }
        }));
        console.log(`✅ found: ${response.Item}`);
        console.log(response.Item);
    } catch (err: any) {
        if (err.name === "ResourceInUseException") {
            console.log(`⚠️ already exists:`);
        } else {
            console.error(`❌ Failed to find`, err);
        }
    }
}

createTable();
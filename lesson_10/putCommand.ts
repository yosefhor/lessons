process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

async function createTable(tableName: string) {
    try {
        const start: number = performance.now();
        for (let i = 1; i < 1000; i++) {
            await client.send(new PutCommand({
                TableName: tableName,
                Item: {
                    userID: `U001`,
                    RegistrationDate: new Date().toISOString(),
                    additionalAttribute: `Attribute-${i}`,
                }
            }));
        }
        console.log(`Time for the process: ${performance.now() - start}`);
        console.log(`✅ created in: ${tableName}`);
    } catch (err: any) {
        if (err.name === "ResourceInUseException") {
            console.log(`⚠️ already exists:`);
        } else {
            console.error(`❌ Failed to create`, err);
        }
    }
}

const tableUsers = 'Users';
const tableUsersLSI = 'users_LSI';
const tableUsersGSI = 'users_GSI';

createTable(tableUsers);
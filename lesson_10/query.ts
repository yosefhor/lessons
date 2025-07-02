process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

async function createTable() {
    try {
        const tableName: string = "UsersWithGSI";
        // const indexName: string = "";
        const result: any[] = [];
        const start: number = performance.now();
        for (let i = 1; i < 100; i++) {
            const response: any = await client.send(new QueryCommand({
                TableName: tableName,
                // IndexName: indexName,
                KeyConditionExpression: 'userID = :id',
                ExpressionAttributeValues: {
                    ':id': 'U001'
                }
            }));
            result.push(response.Items)
        }
        console.log(`Time for the process: ${performance.now() - start}`);
        console.log(`✅`, result);
    } catch (err: any) {
        if (err.name === "ResourceInUseException") {
            console.log(`⚠️ already exists:`);
        } else {
            console.error(`❌ Failed to create`, err);
        }
    }
}

createTable();
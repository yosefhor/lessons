process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

async function runQuery() {
    try {
        const tableName: string = "users_GSI";
        // const indexName: string = "";
        const result: any[] = [];
        const start: number = performance.now();
        // for (let i = 1; i < 100; i++) {
            const response: any = await client.send(new QueryCommand({
                TableName: tableName,
                IndexName: 'RegistrationDate_index',
                KeyConditionExpression: 'userID = :uid AND RegistrationDate BETWEEN :start AND :end',
                ExpressionAttributeValues: {
                    ':uid': 'U001',
                    ':start': '2025-07-02T20:00:46.516Z',
                    ':end': '2025-07-02T20:01:46.494Z'
                }
            }));
            result.push(response.Items)
        // }
        console.log(`Time for the process: ${performance.now() - start}`);
        console.log(`✅`);
    } catch (err: any) {
        if (err.name === "ResourceInUseException") {
            console.log(`⚠️ already exists:`);
        } else {
            console.error(`❌ Failed to create`, err);
        }
    }
}

runQuery();
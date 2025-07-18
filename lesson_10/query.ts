process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { client } from "./lib/dynamoClient.ts";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

async function runQuery(): Promise<any> {
    try {
        const tableName: string = "users_GSI";
        // const indexName: string = "";
        const result: any[] = [];
        const start: number = performance.now();
        // for (let i = 1; i < 1000; i++) {
            const response: any = await client.send(new QueryCommand({
                TableName: tableName,
                IndexName: 'userID_additionalAttribute_index',
                KeyConditionExpression: 'userID = :uid AND additionalAttribute BETWEEN :start AND :end',
                ExpressionAttributeValues: {
                    ':uid': 'U001',
                    ':start': 'Attribute-1',
                    ':end': 'Attribute-600'
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
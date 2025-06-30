import { ddbDocClient } from "../lib/dynamoClient";
import { ScanCommand, UpdateCommand, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
export const handler = async () => {
    // 1. שליפת פעילויות מוכנות
    const { Items = [] } = await ddbDocClient.send(new ScanCommand({
        TableName: "Activities",
        FilterExpression: "status = :s",
        ExpressionAttributeValues: {
            ":s": "ready",
        },
    }));
    for (const activity of Items) {
        const dependencies = activity.dependencies || [];
        // 2. בדיקה שכל התלויות הושלמו
        const allDepsCompleted = await Promise.all(dependencies.map(async (depID) => {
            const depRes = await ddbDocClient.send(new GetCommand({
                TableName: 'Activities',
                Key: { ActivityID: depID }
            }));
            return depRes.Item?.status === "completed";
        }));
        if (allDepsCompleted.every(Boolean)) {
            // 3. שינוי סטטוס
            await ddbDocClient.send(new UpdateCommand({
                TableName: "Activities",
                Key: { ActivityID: activity.ActivityID },
                UpdateExpression: "set status = :newStatus",
                ExpressionAttributeValues: {
                    ":newStatus": "in_progress",
                },
            }));
            // 4. לוג
            await ddbDocClient.send(new PutCommand({
                TableName: "ExecutionLog",
                Item: {
                    LogID: `log-${Date.now()}`,
                    EntityID: activity.ActivityID,
                    type: "START",
                    timestamp: new Date().toISOString(),
                },
            }));
            console.log(`✔️ Activity ${activity.ActivityID} started`);
        }
    }
};

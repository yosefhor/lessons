process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { BillingMode, UpdateTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./lib/dynamoClient.ts";

async function createGSI() {
    try {
        const command = new UpdateTableCommand({
            TableName: "Users",
            AttributeDefinitions: [
                { AttributeName: "LastLogin", AttributeType: "S" }
            ],
            GlobalSecondaryIndexUpdates: [
                {
                    Create: {
                        IndexName: "LastLoginIndex",
                        KeySchema: [
                            { AttributeName: "LastLogin", KeyType: "HASH" }
                        ],
                        Projection: {
                            ProjectionType: "ALL"
                        },
                    }
                }
            ]
        });

        const result = await client.send(command);
        console.log("✅ GSI LastLoginIndex נוצר בהצלחה", result);
    } catch (err) {
        console.error("❌ שגיאה ביצירת GSI:", err);
    }
}

createGSI();

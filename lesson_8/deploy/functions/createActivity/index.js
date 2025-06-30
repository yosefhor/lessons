import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamoClient.js";
import { v4 as uuidv4 } from "uuid";
export const handler = async (event) => {
    try {
        if (!event.body)
            return { statusCode: 400, body: "Missing request body" };
        const { sequenceId, name, duration, resources } = JSON.parse(event.body);
        if (!sequenceId || !name || !duration) {
            return { statusCode: 400, body: "Missing required fields" };
        }
        const activityId = uuidv4();
        const newActivity = {
            ActivityID: activityId,
            SequenceID: sequenceId,
            Name: name,
            Duration: duration,
            Resources: resources || {},
            Status: "NotStarted",
        };
        await ddbDocClient.send(new PutCommand({ TableName: "Activities", Item: newActivity }));
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Activity added", activity: newActivity }),
        };
    }
    catch (err) {
        console.error("❌ Error adding activity:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

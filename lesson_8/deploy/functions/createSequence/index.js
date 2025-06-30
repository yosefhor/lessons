import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamoClient.js";
import { v4 as uuidv4 } from "uuid";
export const handler = async (event) => {
    try {
        if (!event.body)
            return { statusCode: 400, body: "Missing request body" };
        const { projectId, steps, dependencies } = JSON.parse(event.body);
        if (!projectId || !Array.isArray(steps)) {
            return { statusCode: 400, body: "Missing or invalid fields" };
        }
        const sequenceId = uuidv4();
        const newSequence = {
            SequenceID: sequenceId,
            ProjectID: projectId,
            Steps: steps,
            Dependencies: dependencies || [],
            Status: "NotStarted",
        };
        await ddbDocClient.send(new PutCommand({ TableName: "TaskSequences", Item: newSequence }));
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Sequence added", sequence: newSequence }),
        };
    }
    catch (err) {
        console.error("❌ Error adding sequence:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

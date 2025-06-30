import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamoClient";
import { v4 as uuidv4 } from "uuid";
export const handler = async (event) => {
    try {
        if (!event.body) {
            return { statusCode: 400, body: "Missing request body" };
        }
        const { projectName, owner } = JSON.parse(event.body);
        if (!projectName || !owner) {
            return { statusCode: 400, body: "Missing required fields" };
        }
        const projectId = uuidv4();
        const createdAt = new Date().toISOString();
        const newProject = {
            ProjectID: projectId,
            ProjectName: projectName,
            Owner: owner,
            Status: "Pending",
            CreatedAt: createdAt,
        };
        await ddbDocClient.send(new PutCommand({
            TableName: "Projects",
            Item: newProject,
        }));
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Project created", project: newProject }),
        };
    }
    catch (err) {
        console.error("❌ Error creating project:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

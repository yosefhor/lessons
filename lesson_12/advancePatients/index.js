import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const docClient = new DynamoDBClient();

export async function handler(event) {
  try {
    const now = new Date().toISOString();

    // שלב 1: חיפוש בתור פריטים שהסתיימו
    const { Items: completedItems } = await docClient.scan({
      TableName: 'PatientsQueue',
      FilterExpression: '#status = :completed AND #endTime <= :now',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#endTime': 'endTime'
      },
      ExpressionAttributeValues: {
        ':completed': 'completed',
        ':now': now
      }
    }).promise();

    if (completedItems.length === 0) {
      console.log("No completed patients found.");
      return { statusCode: 200, body: 'No completed patients' };
    }

    for (const item of completedItems) {
      const { id, ...rest } = item;

      const transactParams = {
        TransactItems: [
          {
            Put: {
              TableName: 'Patients',
              Item: {
                id,
                ...rest,
                promotedAt: now
              },
              ConditionExpression: 'attribute_not_exists(id)' // לא להכניס אם כבר קיים
            }
          },
          {
            Delete: {
              TableName: 'PatientsQueue',
              Key: { id },
              ConditionExpression: 'attribute_exists(id)' // מחיקה רק אם באמת קיים
            }
          }
        ]
      };

      try {
        await docClient.transactWrite(transactParams).promise();
        console.log(`Patient ${id} promoted successfully`);
      } catch (err) {
        console.error(`Transaction failed for patient ${id}`, err);
      }
    }

    return { statusCode: 200, body: 'Promotion cycle complete' };
  } catch (err) {
    console.error('Unexpected error', err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
}

import express, { Router, Request, Response } from 'express';
import { ddbDocClient } from '../lib/dynamoClient';
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, owner } = req.body;
    if (!name || !owner) {
      res.status(400).json({ error: 'Missing name or owner' });
      return
    }

    const projectId = uuidv4();
    const createdAt = new Date().toISOString();

    await ddbDocClient.send(new PutCommand({
      TableName: 'Projects',
      Item: {
        ProjectID: projectId,
        Name: name,
        Owner: owner,
        Status: 'active',
        CreatedAt: createdAt
      }
    }));

    res.status(201).json({ projectId });
  } catch (err) {
    console.error('Error creating project', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// שליפת פרויקט עם כל הרצפים והפעילויות שלו
router.get('/:projectId', async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    // שליפת פרויקט
    const projectData = await ddbDocClient.send(new GetCommand({
      TableName: 'Projects',
      Key: { ProjectID: projectId },
    }));

    if (!projectData.Item) {
      res.status(404).json({ error: 'Project not found' });
      return
    }

    // שליפת סיקוונסים
    const sequencesRes = await ddbDocClient.send(new QueryCommand({
      TableName: 'TaskSequences',
      IndexName: 'ByProject',
      KeyConditionExpression: 'ProjectID = :pid',
      ExpressionAttributeValues: { ':pid': projectId },
    }));

    // שליפת פעילויות לפי סיקוונסים
    const sequencesWithActivities = await Promise.all((sequencesRes.Items || []).map(async (seq) => {
      const actsRes = await ddbDocClient.send(new QueryCommand({
        TableName: 'Activities',
        IndexName: 'BySequence',
        KeyConditionExpression: 'SequenceID = :sid',
        ExpressionAttributeValues: { ':sid': seq.SequenceID },
      }));
      return { ...seq, activities: actsRes.Items || [] };
    }));

    res.json({
      project: projectData.Item,
      sequences: sequencesWithActivities
    });
  } catch (err) {
    console.error('Error fetching project data', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

export default router;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { Router } from "express";
const router = Router();
import { client, ddbDocClient } from "../lib/dynamoClient.js";
import { CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

router.get("/tables", async (req, res) => {
  try {
    const data = await client.send(new ListTablesCommand({}));
    res.json(data.TableNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tables", async (req, res) => {
  try {
    const { tableScheme } = req.body;
    await client.send(new CreateTableCommand(tableScheme));
    res.status(201).json('table created!');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:tableName", async (req, res) => {
  try {
    const putarams = {
      TableName: req.params.tableName,
      Item: req.body.item
    }
    await ddbDocClient.send(new PutCommand(putarams));
    res.status(201).json('item created!');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

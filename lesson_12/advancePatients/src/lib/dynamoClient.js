"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ddbDocClient = exports.client = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var dotenv = require("dotenv");
dotenv.config();
exports.client = new client_dynamodb_1.DynamoDBClient({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
exports.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(exports.client);

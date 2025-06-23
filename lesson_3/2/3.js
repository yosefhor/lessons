process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const streamToString = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString('utf8');
}

const downloadJSON = async (bucketName, fileName) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName
    });

    try {
        const response = await s3Client.send(command);
        const bodyContent = await streamToString(response.Body);
        const data = JSON.parse(bodyContent);
        console.log(data);
    } catch (err) {
        console.error(err);

    }
}

downloadJSON('test1for', 'example.json')
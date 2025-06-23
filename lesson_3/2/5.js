process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

export const streamToString = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString('utf8');
}

const getJSON = async (bucketName, fileName,) => {
    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
    });

    try {
        const response = await s3Client.send(getCommand);
        const bodyContent = await streamToString(response.Body);
        return JSON.parse(bodyContent);
    } catch (err) {
        console.error(err);
    }
}

const putJSON = async (bucketName, fileName, data) => {
    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(data),
    });

    try {
        return await s3Client.send(putCommand);
    } catch (err) {
        console.error(err);
    }
}

const updateJSON = async (bucketName, fileName, updates) => {
    let data = await getJSON(bucketName, fileName)
    for (const key in updates) {
        data[key] = updates[key];
    }
    const response = await putJSON(bucketName, fileName, data)
    console.log(`updated: ${response}`);
}

updateJSON('test1for', 'example.json', { name: `Dan` })

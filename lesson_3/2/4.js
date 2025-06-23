process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const uploadJSON = async (bucketName, fileName, content) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(content)
    });

    try {
        const response = await s3Client.send(command);
        console.log(`uploaded: ${response}`);
    } catch (err) {
        console.error(err);

    }
}

uploadJSON('test1for', 'example.json', { name: `Jack`, age: 40 })
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config()

const app = express()
app.use(express.json())


const s3Client = new S3Client({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const putJSON = async (bucketName, file) => {
    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: Date.now() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    });

    try {
        return await s3Client.send(putCommand);
    } catch (err) {
        console.error(err);
    }
}

const upload = multer({ storage: multer.memoryStorage() })

app.post('/upload', upload.single('myFile'), async (req, res) => {
    const file = req.file;
    try {
        const result = await putJSON('test1for', file)
        res.json('success', result)
    } catch (err) {
        res.json(err);
    }
})

app.get('/download/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const getUrlCommand = new GetObjectCommand({
            Bucket: 'test1for',
            Key: key,
        });
        const url = await getSignedUrl(s3Client, getUrlCommand, { expiresIn: 60 });
        res.redirect(url)
    } catch (err) {
        res.json(err)
    }
})

app.listen(3000)
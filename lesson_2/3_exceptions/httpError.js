import express from 'express';
import logger from './logger.js';

const app = express();
app.use(express.json())
const port = 3000;

app.get('/', (req, res, next) => {
    try {
        if (true) throw new Error('what the hell are you doing here???')
        res.status(200).json('how did you get this?');
    } catch (err) {
        next(err)
    }
})

app.use((err, req, res, next) => {
    logger.error(`${err.message} | URL: ${req.url} | Method: ${req.method}`)
    res.status(400).send(err.message)
})

app.listen(port, () => {
    logger.info(`app is running on port ${port}`);
    logger.silly('hahaha')
})
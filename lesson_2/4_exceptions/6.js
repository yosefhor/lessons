import express from 'express';

const app = express();

app.use(express.json())

app.get('/error', (req, res, next) => {
    throw new Error("error message!!!");
})

app.use((err, req, res, next) => {
    res.status(500).json({ 'error': err.message })
})

app.listen(3000)
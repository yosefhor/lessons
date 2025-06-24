const express = require('express');
const app = express();

app.get('/error', (req, res) => {
    throw new Error('Something went wrong');// must be wrap in Error
});

app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

app.listen(3000);


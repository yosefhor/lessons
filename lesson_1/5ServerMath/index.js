import express from 'express';

const app = express();
app.use(express.json())
const port = 3000;

const operations = {
    'add': (a, b) => { return a + b },
    'minus': (a, b) => { return a - b },
    'multiply': (a, b) => { return a * b },
    'divide': (a, b) => { return a / b }
}

app.get('/calculate', (req, res, next) => {
    const { op, num1, num2 } = req.query;
    const a = Number(num1)
    const b = Number(num2)
    const result = operations[op](a, b)
    res.status(200).json(result);
})

app.use((err, req, res, next) => {
    res.send(err.message)
})

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})
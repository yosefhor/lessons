import express from 'express';

const app = express();
app.use(express.json())
const port = 3000;

const add = (a, b) => { return a + b }
const minus = (a, b) => { return a - b }
const multiply = (a, b) => { return a * b }
const divide = (a, b) => { return a / b }

const operations = {
    'add': add,
    'minus': minus,
    'multiply': multiply,
    'divide': divide,
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
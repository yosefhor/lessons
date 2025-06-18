import express from 'express';

const app = express();
app.use(express.json())
const port = 3000;

const users = [];

app.post('/register', (req, res, next) => {
    const { username, password } = req.body;
    if (users.some(user => user.username === username)) return next(new Error('user already exist'));
    users.push({ username, password });
    res.status(201).send('registeration successfull!');
})

app.get('/users', (req, res, next) => {
    const usersOnly = users.map(user => user.username)
    res.status(200).json(usersOnly);
})

app.use((err, req, res, next) => {
    res.send(err.message)
})

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})
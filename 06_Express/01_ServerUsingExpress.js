import express from 'express';

const app = express();

app.listen(8080, () => {
    console.log('App listening at 8080');
})

app.get('/', (req, res) => {
    res.send(`Welcome to home page`);
})

app.get('/about', (req, res) => {
    res.send(`Hello ${req.query.user}, your age is ${req.query.age}`);
})


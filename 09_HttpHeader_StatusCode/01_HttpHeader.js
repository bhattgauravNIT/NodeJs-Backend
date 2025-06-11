import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
const fsPromise = fs.promises;

app.listen(8080, () => {
    console.log("Listening app at port 8080");
})

/**
 * Get all users: /users
 * 
 */
app.get('/users', async (_req, res) => {
    try {
        console.log('Initiating get on users');
        res.setHeader('X-DevName', 'Gaurav');
        let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');
        users = JSON.parse(users);
        res.status(200).json(users);
    } catch (err) {
        console.log('Oops something wrong in get users: /users ');
        res.status(500).json("Internal server error");
    }
});

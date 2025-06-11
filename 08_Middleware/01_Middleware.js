import express from 'express';
import { Validator } from 'jsonschema';
import schema from '../08_Middleware/UserSchema.js';
import fs from 'fs';


const fsPromise = fs.promises;
const validationOp = new Validator();
const app = express();

app.listen(8080, () => {
    console.log('App listening at port 8080');
})

app.use(express.json());

app.use((req, _res, next) => {
    console.log('This is my 1st own middleware');
    req.name = "Gaurav Bhatt set in 1st middleware"
    next();
});

app.use((req, _res, next) => {
    console.log('This is my 2nd own middleware');
    console.log(req.name);
    next();
});

app.post('/user', userMiddleware, async (req, res) => {
    try {
        console.log('Initiating get on user based on Id');
        const payLoad = req.body;
        let newUserData = {
            id: '',
            first_name: payLoad.first_name,
            last_name: payLoad.last_name,
            email: payLoad.email,
            gender: payLoad.gender,
            job_title: payLoad.job_title
        };
        let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');
        users = JSON.parse(users);
        const existingUser = users.find((user) => user.email == newUserData.email);
        if (existingUser) {
            return res.status(200).json("User is already registered");
        }
        newUserData.id = users[users.length - 1].id + 1;
        users.push(newUserData);
        await fsPromise.writeFile('07_RestApi/MOCK_DATA.json', JSON.stringify(users, null, 2), 'utf-8');
        return res.status(200).json(newUserData);
    } catch (err) {
        console.log('Oops something wrong in post user: /user ');
        res.status(500).json("Internal server error");
    }
});

function userMiddleware(req, res, next) {
    if (!validationOp.validate(req.body, schema.UserSchema).valid) {
        return res.json(validationOp.validate(req.body, schema.UserSchema).errors);
    }
    console.log('Payload successfully validated');
    next();
}
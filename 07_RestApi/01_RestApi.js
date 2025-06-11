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
        let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');
        users = JSON.parse(users);
        res.status(200).json(users);
    } catch (err) {
        console.log('Oops something wrong in get users: /users ');
        res.status(500).json("Internal server error");
    }
});

/**
 * 
 * Get user by user id: /user/:userId
 * 
 */
app.get('/user/:userId', async (req, res) => {
    try {
        console.log('Initiating get on user based on Id');
        let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');
        users = JSON.parse(users);
        const resp = users.find((user) => user.id == req.params.userId);
        res.status(200).json(resp);
    } catch (err) {
        console.log('Oops something wrong in get user by Id: /users/:userId ');
        res.status(500).json("Internal server error");
    }
});

/**
 * 
 * Post a new user: /user
 * 
 */
app.post('/user', async (req, res) => {
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

/**
 * 
 * Put or update data of an existing user: /user/:userId
 */
app.put('/user/:userId', async (req, res) => {
    try {
        console.log('Initiating get on user based on Id');
        const payLoad = req.body;
        let updateUserData = {
            id: '',
            first_name: payLoad.first_name,
            last_name: payLoad.last_name,
            email: payLoad.email,
            gender: payLoad.gender,
            job_title: payLoad.job_title
        };
        let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');
        users = JSON.parse(users);
        let existingUser = users.find((user) => user.id == req.params.userId);
        if (!existingUser) {
            return res.status(200).json("User not found");
        }
        updateUserData.id = existingUser.id;
        users = users.filter((item) => item.id !== existingUser.id);
        users.push(updateUserData);
        await fsPromise.writeFile('07_RestApi/MOCK_DATA.json', JSON.stringify(users, null, 2), 'utf-8');
        return res.status(200).json('User updated successfully');
    } catch (err) {
        console.log('Oops something wrong in put user: /user/:userId ');
        res.status(500).json("Internal server error");
    }
});

/**
 * 
 * Delete a user: /user/:userId
 */
app.delete('/user/:userId', async (req, res) => {
    try {
        console.log('Initiating delete on user based on Id');
        let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');
        users = JSON.parse(users);
        let existingUser = users.find((user) => user.id == req.params.userId);
        if (!existingUser) {
            return res.status(200).json("User not found");
        }
        users = users.filter((item) => item.id !== existingUser.id);
        await fsPromise.writeFile('07_RestApi/MOCK_DATA.json', JSON.stringify(users, null, 2), 'utf-8');
        return res.status(200).json('User deleted successfully');
    } catch (err) {
        console.log('Oops something wrong in delete user: /user/:userId ');
        res.status(500).json("Internal server error");
    }
});

function _getUsers() {

}
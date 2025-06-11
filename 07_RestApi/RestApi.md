**RESTful API (Representational State Transfer API)**

It is an architectural style that allows the client (like a web browser or mobile app) and the server (where data is stored) to interact with each other over the internet.

For example, if a client sends a request like GET /books, it is asking the server to send back a list of books — this is called requesting a resource.

The request hits a specific endpoint (a URL on the server).The server processes the request, fetches the required data (e.g., from a database)Then sends back a response usually in JSON format or may be server side rendering or XML etc.

This entire flow — from making a request to getting a response — is what a REST API handles.

Lets understand it by creation of few api's.

```javascript
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
app.get('/users', async (req, res) => {
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
```

app.use(express.json()); is used to get the payload.

Lets understand some basic of when we write to a file. So we were sending a json payload to write to this file, now
this json payload is an json object, we can't write objects to file rather we write text to it, thus while writing we
write data as JSON.stringify(users, null, 2), where 2 is the indentation. Now 'utf-8' resemble that it tells the Node js 
to write the text in file using utf-8 encoding standards.

Now when we read a file say 
let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json');

this comes as a buffer and therefore using
let users = await fsPromise.readFile('07_RestApi/MOCK_DATA.json', 'utf-8');

tells Node js to read this file not a raw buffer but a utf-8 encoded string.
Now we need to convert it back to json using JSON.parse(users);

So in short:

Write -> Convert JSON object to text with utf-8 encoding
read -> read as utf-8 encoded text and convert to Json object.

writes generally update or over write on entire file.

A better way of handling users was that in every call we are reading from the file 07_RestApi/MOCK_DATA.json, so we could have
simply imported this data and only written to the file.

import usersData from '../07_RestApi/MOCK_DATA.json' assert { type: "json" }

and then could have used this usersData directly instead reading again and again from file, this use case suits it.

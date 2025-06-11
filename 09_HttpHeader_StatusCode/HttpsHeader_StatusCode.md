**Http Header**

When a request is send from a client to a server and a response is sent back from a server to a client , both of these
req and response gets attached with some meta data information, which is important for processing of both the request and the response.

This meta data info is called as headers.

For example when we used the middleware app.use(express.json()); in the server, 

the postman which was making the request or acting as client formulated a header content-type as application/json because we were
sending json payload for post call of users. This headers is processed by this middleware and seeing it as json, it formulated 
a key value pair from the payload.


In the similar way the headers attached by response can also e seen and used at the client side.

All custom headers or headers which are not created by-default are generally prefixed with X-

So generally when express resolves a request it includes a header in response as X-Powered-By whose value is express.

So if we want to create our own custom header its recommended to prefix it with X-.

Ex: 

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
```

Here we have set introduced a custom header via res.setHeader('X-DevName', 'Gaurav') and can see it in response headers.


**Http Status Code**

100->199 is information status codes
200->299 is success status codes
300->399 is redirection status code
400->499 is client error status codes
500->599 is server error status codes.
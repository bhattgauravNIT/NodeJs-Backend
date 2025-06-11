Node js allows us to create a simple basic server without use of express framework.

We can simply create a Http server via importing http in built module in Node js.

import http from 'http';

All inbuilt imports are named as they start with lower case like fs or http.

Now this http can be used to to create a server using createServer method. This method accepts a callback with param of 
req and response. Req includes all meta data of the client which is send by browser where as the response is what we need to send back.

```javascript
import http from 'http';
import fs from 'fs';

const myServer = http.createServer((req, res) => {
    let date = new Date();
    fs.appendFile('serverLogs.Txt', `${date.getTime()}-> Received request from ${req.url}\n`, (err,res)=>{
        if(err){
            console.log(`Oops something went wrong! Unable to write to Server logs`);
        }
    });
    res.end(`Hello welcome to ${req.url}`);
})

myServer.listen('8080', () => {
    console.log('Server listening at port 8080');
})
```

So we create a new server myServer using http.createServer and also writing to a file which is serverLogs.txt to maintain
server logs. We are using append as it retains the previous state of the file while appending new data to it.

We have defined a port for our server using myServer.listen and have assigned a port 8080 to it, it also expects a
call back of listening listener where we have given a log statement stating port at which the server has started.


**Url**

Url refers to uniform resource locator. While writing an http server using http.createServer, the req is
the metadata of the client sended by the browser however in the url the client can even send the query params, and there in order
to get hold of these query params, instead of going through the url and then applying some regex to get the query param, the cleaner way
is to use url package of npm.

```javascript
import http from 'http';
import fs from 'fs';
import url from 'url';

const myServer = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') return res.end();
    let date = new Date();
    fs.appendFile('serverLogs.Txt', `${date.getTime()} -> Received request from ${req.url}\n`, (err, res) => {
        if (err) {
            console.log(`Oops something went wrong! Unable to write to Server logs`);
        }
    });
    const param = url.parse(req.url, true);
    handleRequest(param, res);
})

function handleRequest(param, res) {
    switch (param.pathname) {
        case "/home":
            res.end(`Welcome to Home`);
            break;
        case "/about":
            const userName = param.query.name;
            res.end(`Hi ${userName}, great to have you here !`);
            break;
        case "/search":
            const search = param.query.search;
            res.end(`Showing the results for ${search}`);
            break;
        default:
            res.end("Not found");
    }
}

myServer.listen('8081', () => {
    console.log('Server listening at port 8081');
})
```

So after installing url package we can import it. Now url.parse method helps us getting hold of query params from the req.url and
a boolean true marked to it helps in formulating all query params as an object of key value pair. Therefore 
const param = url.parse(req.url, true);

Now using param we can fetch query object as param.query and then get hold of the properties inside it.


**Http Methods**

There are different Http methods like 

GET /users/{{userId}}
→ Get user with ID {{userId}}.

POST /users
→ Create a new user (data in request body).

PUT /users/{{userId}}
→ Replace entire user {{userId}} with new data.

PATCH /users/{{userId}}
→ Update part of user {{userId}}'s data (e.g., just the email).

DELETE /users/{{userId}}
→ Delete user with ID {{userId}}.

So in case we want to first time add data we will use post, and if we wish to update an existing data entirely 
we will use put and if we wish to update only partial segments within existing data we use patch.

```javascript
import http from 'http';
import fs from 'fs';
import url from 'url';

const myServer = http.createServer((req, res) => {
    console.log(req.method);
    if (req.url === '/favicon.ico') return res.end();
    let date = new Date();
    fs.appendFile('serverLogs.Txt', `${date.getTime()} -> Received request from ${req.url}\n`, (err, res) => {
        if (err) {
            console.log(`Oops something went wrong! Unable to write to Server logs`);
        }
    });
    const param = url.parse(req.url, true);
    handleRequest(param, req, res);
})

function handleRequest(param, req, res) {
    switch (param.pathname) {
        case "/":
            if (req.method === "GET") {
                //make some get call to fetch data
            } else if (req.method === "POST") {
                // make some post call to insert some data
            } else if (req.method === "PUT") {
                // make some DB call to update some data
            } else if (req.method === "PATCH") {
                // make some DB call to update some portion of the data
            } else {
                // make the DB call to delete the data
            }
            res.end(`Welcome to Home`);
            break;
        case "/about":
            const userName = param.query.name;
            res.end(`Hi ${userName}, great to have you here !`);
            break;
        case "/search":
            const search = param.query.search;
            res.end(`Showing the results for ${search}`);
            break;
        default:
            res.end("Not found");
    }
}

myServer.listen('8082', () => {
    console.log('Server listening at port 8082');
})
```

The problem with writing such native servers is that for a very big code base its hard to manage such code and even to scale up
therefore express framework is used which helps us in management of huge code.
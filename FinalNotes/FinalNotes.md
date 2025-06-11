**Node js**

Node js is a run time env for execution of java script. Previously java script was simply a client side language only because
java script could be compiled via java script engine which were present in browsers like chrome uses v8 engine, where as
fire fox uses spider monkey. So what happened is these guys took out this v9 engine from chrome and integrated it with some c++
due to this node js was born. Thus node js is simply a run time for execution of js and its not a framework or a library.

Now node js is capable of compiling js files but say if we write our file in ts will it be able to compile. The answer is no.
However there is a hack, we can convert a ts file into a js file using $ tsc fileName, after this a js file will get generated and now
we can run this js file using say $ node fileName.

Once we install node js, the npm which is node packet manager which is ideally responsible for handling various libraries or packages
in pur project will get installed.

The package.json is the main configuration file in our node js project. Its responsible for handling the scripts, managing package version,
dev dependencies, test scripts etc. It can be generated via npm using npm init command.

In node js there are certain js functions which are not available, like in node js we can't access window object or alert but however
these same are available in browser. The main reason behind it is while embedding the v8 engine with c++ since the need was to create a server
side env and thus all dom related functionalities or features were being removed and new features like file handling, hashing, crypting etc
were being introduced.

In in this project we have a package.json which is the main configuration file. Main.js file acts as an entry points in our application
and in package.json we have a script property like 

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node main.js"
},

so npm run start will trigger the command node main.js and thus applications entry point will be invoked.


<--------------------------------------------------------------------------------->

**Modules**

Any application is not written within a single file and thus multiple modules are created for better code readability and understanding
as well as debugging with every module performing its own set of duties. For ex we have a module math.js which can be used
for all computational logic in our application.

Moreover we have used module type as es6 and not common js module which is latest syntax for node projects. It can be seen in package.json as

{
    "type": "module"
}


**Common js vs ES6 modules**

ES6 are used by modern node projects and the way we import and export modules that syntax changes.
Common js imports modules are synchronous in nature meaning once in common js we encounter a require statement like 

Common js:

const module1 = require('...path to module1') 
const module2 = require('...path to maths module2') 

the execution is halted at module1 require till the module is imported.
Then it goes to next require statement which is asking for module2.


ES6:

import module1 from '../path to module1'
import module2 from '../path to module2'


However in es6 this is asynchronous meaning it parallely keeps loading the module wherever it sees a import and the execution is not halted 
to import just the first module itself. There after once all module which were needed are imported the normal code execution is started for the
logic which needs these module. So the compiler sees import statement for module 1 starts importing it and build a module graph, now
goes to next lines sees import for module 2 even before import of module 1 is complete and parallely starts importing module 2 even and insert in module graph.

Now once all modules are imported then comes for rest logical code execution.

Thus es6 module are better for performance wise.


**Different exports & imports in es6 module**

A module can export its members or functions in 3 ways:

1) default export 
2) named exports
3) mixed default and named exports


a) In default export it acts as one primary export of the module so say my module has 3 functions func1,func2 and func3
we can export them as public members as 

export default {
    func1, func2, func3
}

now in import, this export can be named anything i,e import myNamedModule from '.../module path' amd can be accessed as
myNamedModule.func1, myNamedModule.func2, myNamedModule.func3.

This is one primary export using default keyword and there fore even if we don't export entire object and export individual functions like

export default func1(){}
export default func2(){}
export default func3(){}

with more than one default keyword

This will fail and throw error because a module can have one primary default export. So to sum up, default exports are primary i,e one export default per module and can be named anything while importing.


b) In named exports these can be multiple named exports in a module and has to be imported with {} curly brackets only, in the consuming module.

export func1(){}
export func2(){}
export func3(){}

or 

export {func1, func2}

So in import these has to be imported via a curly as import {func1,func2,func3} from '.../path to module' and can be renamed
like {func1 as fun1, func2 as fun2, func3 as fun3} from '.../path to module'. We are here doing nothing but destructing of export object.


c) mixed default and named exports

say 

export default func1(){};
export func2(){};

so it will be imported as 

import func1, {func2} from '...path to module'
or
import myNamedFunc1, {func2 as fun2} from '.../path to module'


So to summarize, any default export is primary export and default keyword can be used once, with default keyword the object exported
can be imported without curly brackets and with any name, while normal named exports has to be imported via curly brackets with same name and
can be renamed using 'as' key word in consuming module's import.


Note: if we import like say import math from './checks-in-current-directory', so ./ checks in current directory whereas if we 
do something like import fs from 'fs', so it checks this in its node default installed packages or external installed packages.


<------------------------------------------------------------------------------------------------->

**Node js Architecture**


Js is by default synchronous in nature, this means code execution happens line by line, now problem with line by line
execution is that its blocking, in case it comes across a code which needs time to execute, then it gets blocked at
that line and until this line of code gets completed it don't move to the next line.

Now when js is used as a server side language this behavior of js can make it very very slow.
Therefore in order to over come this the Node js architecture is designed in such a way that it can handle both blocking/synchronous
request and non-blocking/asynchronous request.

Js arch has call stack , a event queue and a event loop along a thread pool which makes this happen.

Js runs on a main thread lets call it js thread. Now there can be two types of request which can come in an asynchronous (non blocking) or synchronous (blocking). 

Lets understand this with help of example:

Say we are writing to a file

import fs from 'fs';

fs.writeFileSync('temp.txt', "{name: 'Gaurav', mobileNumber: '987xxxx'}");

Now we can read from this file in two ways:

**a) Asynchronous or non blocking code:**

console.log(1);
fs.readFile('temp.txt', (err, data) => {
     console.log(data.toString());
 })
console.log(2);

o/p is: 
1
2
{name: 'Gaurav', mobileNumber: '987xxxx'}

Lets understand how this non blocking things gets executed.

Js main thread runs, pushes console.log(1) to call stack executes it and pops from call stack.
Now see an asynchronous call fs.readFile() pushes to call stack but this will need time to go and read data from file so, assigns it
to a thread in thread pool to do this job (via libuv) and the main thread does not gets blocked, main js thread moves to next line pushes console.log(2) in call stack executes it and pops out of queue, now the thread was working in background completes his job and pushes a call back to
event queue. Event loop sees that call stack is empty so pushes callback to call stack and console.log(data.toString()) gets executed.

The thread pool has limited threads like generally 4 but however it can be increased to max number of cores of the system only.

**b) Synchronous or blocking code:**

console.log(1);
console.log(fs.readFileSync('temp.txt', 'utf-8'));
console.log(2);

o/p is: 
1
{name: 'Gaurav', mobileNumber: '987xxxx'}
2

Js main thread runs, pushes console.log(1) to call stack executes it and pops from call stack.
Now sees a synchronous blocking operation, the main js thread starts processing temp.txt file thread halts further execution until reading is complete. The call stack is paused until file reading is done. Now once complete , fs.readFileSync is now removed from call stack, 
the execution again starts pushes console.log(2), executes it and pops from stack. No thread pool is involved.

Note: This behavior of NOde js makes it slow as if non blocking code comes it assigns to thread pool as by default 4 threads are there, and threads
can be increased but upto limit of cores of CPU thus still limited threads can cause an issue, If a blocking request comes, program is halted till
execution is finished.


Now lets see what happens when we use async and await. Async is by default non blocking but if we use await does the program waits for the
execution to be completed and then only executes next, ain't this makes async blocking ??

The answer is no. We use await inside a async function lets see

async function getData() {
  const data = await fetchData();  // pauses here inside getData()
  console.log("Fetched:", data);
}

getData();
console.log("This still runs without waiting for fetch!");

Now see how execution happens, the js main thread runs, defines async function getData only, no execution, see execution of getData so starts
execution, reaches const data = await fetchData(); its await so assign a thread pool to do the job, halts the function execution of getData 
only, however continues execution of the rest program, sees console.log("This still runs without waiting for fetch!"); executes it.
Now say const data = await fetchData(); gets resolved so logs it.

Thus using a await inside async halts the function execution only from that point and not the entire program.


<--------------------------------------------------------------------------------------->

**File system**


FFile system or FS is a in built package in Node which allows us to interact or create files within the system.

import fs from 'fs';

It offers both synchronous and asynchronous operations on read , write etc.

Some example are:

**ASynchronous/Non Blocking**

fs.readFile('temp.txt', (err, data) => {
     console.log(data.toString());
})

fs.writeFile('example.txt', 'Hello, world!', 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully!');
});

Node.js v10+, provides a modern, Promise-based API. Perfect for async/await and provides a clearer syntax as compared to
callbacks for ASynchronous calls

await fs.promise.readFile(temp.txt', 'utf-8')


**Synchronous/Blocking**

fs.readFileSync('temp.txt', 'utf-8')

fs.writeFileSync('temp.txt', "{name: 'Gaurav', mobileNumber: '987xxxx'}")


Thus its generally better to use a asynchronous or non blocking code or file system method as the server will be able
to handle other request as well and wont slow down the server.

Now in case all my threads of thread pools gets utilized is there a bootle, not much as the task will then be queued and once
a thread is free that task will be taken up, however with synchronous code the main js thread will get blocked. In case of 
asynchronous operations the server will still be responsive without crash. 

Sometimes for writing very large file we can use streaming APIs  like fs.createReadStream();


<------------------------------------------------------------------------------------------->

**Node HTTP server**

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
therefore express framework is used which helps us in management of huge code and provide in built http modules and many more.


<------------------------------------------------------------------------------------------------>

**Express**

So in order to over come the problem of native http module servers where the code was non manageable and also non scalable,
we use express framework.

Thus in order to create a server using express js we first need to install express using
npm i express and then simply:

```javascript
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
```

**Versioning in Node js**

All the packages or modules which we need in our application are installed and their versions are provided in package.json.
Package lock.json provide the versions for the inter dependent modules, packages of these main module in package.json
which we have installed.

Now say we have installed express in our application so in the package.json we can see

"express": "^5.1.0",

Lets understand this Versioning:

in 5.1.0

5 resembles major change of version and thus updating this can be a possible ground breaking change.
1 resembles recommended bug fix within the version of 5
0 resembles minor bugFix or change within the version 5.

Now there are some symbols like:

^ -> carrot symbol. This means that we are saying if i upgrade my server then you can update all recommended and minor 
bugFix versions i,e you are allowed to change 1 and 0 however the main version i,e 5 should not be changed on updates.

So in case a 6 version is released somewhere in future and if i place an update command i,e ncu -u (to update package.json)
then my main version i,e 5 for express should never be updated, however only recommended and minor version changes are allowed.

~ -> squash symbol means that only minor change version update is allowed and not recommended and entire version change.
So suppose in package.json 

"express": "~5.1.0",

Means when i will update my package.json using ncu-u then only 0 value upgrades are allowed and not even recommended i,e 1
and entire version change i, 5 are not allowed.

<-------------------------------------------------------------------------------------------->

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

<----------------------------------------------------------------------------------------------------------------->

**Middleware**

When a client makes a request to a sever, server has api end points like say

get -> /users,
post -> /user

Even before the request reaches the end point, there are middlewares which can be placed in servers. The role of these middlewares
is to do some early processing onto the request which may be needed before reaching the end point. For ex:

A middleware can be used to validate a json schema in case of an post request, or even to allow express to be able to understand
an json payload.

The way these middlewares works is that there can be n number of middlewares placed before the request reaches actual end point.
These middlewares are stacked on top of each other and once one middleware completes its job, the request is then sent to subsequent
middleware via next(). Any change in the request at any stage of the middleware will reflect these changes in the subsequent middlewares even.

Lets understand it.

When we sended a JSON payload through postman, in order for express to be able to understand it, an middleware was being placed
i,e app.use(express.json());

so express.json() was our middleware function in this case.

Similarly we can create our own middleware function and use it with app.use(customMiddleware) or even in end point as

app.get('/user', myMiddleware, (req,res)=>{

});


Lets see with help of an code.

```javascript
import express from 'express';
import { Validator } from 'jsonschema';
import schema from '../08_Middleware/UserSchema.js';
import fs from 'fs';


const fsPromise = fs.promises;
const validationOp = new Validator();

app.listen(8080, () => {
    console.log('App listening at port 8080');
})

const app = express();

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
```

so after app= express() we have 4 middlewares placed.

1. 

app.use(express.json());

2. 

app.use((req, _res, next) => {
    console.log('This is my 1st own middleware');
    req.name = "Gaurav Bhatt set in 1st middleware"
    next();
});

3. 

app.use((req, _res, next) => {
    console.log('This is my 2nd own middleware');
    console.log(req.name);
    next();
});

4. userMiddleware which is


function userMiddleware(req, res, next) {
    if (!validationOp.validate(req.body, schema.UserSchema).valid) {
        return res.json(validationOp.validate(req.body, schema.UserSchema).errors);
    }
    console.log('Payload successfully validated');
    next();
}

These all are stacked on top of each other and once one middleware finishes its task the another middleware
is invoked using next();

Change is req.name in 2nd middleware is reflected in the subsequent middlewares after it i,e middleware 3 & 4.

The 4th middleware i,e userMiddleware is used to validate the schema of user, for this we are using the jsonschema package
and the Validator class is imported from it. A new instance of Validator class is created and then we use

validationOp.validate(req.body, schema.UserSchema).valid

Any error in the schema can be seen via 

validationOp.validate(req.body, schema.UserSchema).errors, the schema for user looks like

```javascript
const UserSchema = {
    id: 'User Schema',
    schema: 'User Schema',
    type: 'object',
    properties: {
        "first_name": {
            type: "string"
        },
        "last_name": {
            type: "string"
        },
        "email": {
            type: "string"
        },
        "gender": {
            type: "string"
        },
        "job_title": {
            type: "string"
        }
    },
    required: ['first_name', 'last_name', 'email', 'gender', 'job_title']
};
export default {
    UserSchema
}
```

<-------------------------------------------------------------------------------------------->

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

Here we have introduced a custom header via res.setHeader('X-DevName', 'Gaurav') and can see it in response headers.


**Http Status Code**

100->199 is information status codes
200->299 is success status codes
300->399 is redirection status code
400->499 is client error status codes
500->599 is server error status codes.

<------------------------------------------------------------------------------------->

**Api & Mongo Db**

Mongo Db is a non relational database and NOSQL database. Like in any other DB, mongo db also has tables which are known as
collections. 

So first there has to be a database, inside data base there can be multiple collections and every collection should have a schema.

Ex: In this case we have db Gaurav and a collection inside it User.

After installing mongodb we can install mongo shell and then use command (locally)

# mongosh -> To enter mongo shell script
# show dbs -> To show all databases
# use Db1  -> To enter inside a database

Lets understand this with help of some end points where we will be use mongo db directly.

```javascript
import express from "express";
import mongoose from "mongoose";

const app = express();
const dbName = "Gaurav";
const mongoUrl = `mongodb://127.0.0.1:27017/${dbName}`;

app.use(express.json());

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "FirstName is required"],
        minLength: [2, "First name should have min 2 chars"],
        maxLength: [50, "First name can have max 50 chars"],
        trim: true
    },
    lastName: {
        type: String,
        minLength: [2, "Last name should have min 2 chars"],
        maxLength: [50, "Last name can have max 50 chars"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
        trim: true
    },
    job_title: {
        type: String,
        trim: true
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

app.listen(8080, () => {
    console.log("Server started listening at port 8080");
});

(async function connectMongoDb() {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`Mongo connection success at ${mongoUrl}`);
    } catch (err) {
        console.log(err);
    }
})();

/**
 * Get all users: /users
 * 
 */
app.get('/users', async (_req, res) => {
    try {
        console.log('Initiating get on users');
        let users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.log('Oops something wrong in get users: /users ');
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
        console.log('Initiating post on user');
        const newUser = await User.create(req.body);
        return res.status(200).json(newUser);
    } catch (err) {
        console.log('Oops something wrong in post user: /user ');
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
        const id = req.params.userId;
        const resp = await User.findById(id);
        res.status(200).json(resp);
    } catch (err) {
        console.log('Oops something wrong in get user by Id: /users/:userId ');
        res.status(500).json("Internal server error");
    }
});

/**
 * 
 * Put or update data of an existing user: /user/:userId
 */
app.put('/user/:userId', async (req, res) => {
    try {
        console.log('Initiating update on user based on Id');
        const resp = await User.findByIdAndUpdate(req.params.userId, req.body);
        return res.status(200).json(resp);
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
        const resp = await User.findByIdAndDelete(req.params.userId);
        return res.status(200).json('User deleted successfully');
    } catch (err) {
        console.log('Oops something wrong in delete user: /user/:userId ');
        res.status(500).json("Internal server error");
    }
});
```

So first we installed mongoose and imported it. Then a connection needs to be made to our mongo DB
via mongoose on an URl, this url we have obtained from mongosh which is a shell script for mongo db.
Now in the mongo url in last we have given an database name const mongoUrl = `mongodb://127.0.0.1:27017/${dbName}`;

In case database is not created already , so it gets created on the first document upload or entry insertion
inside the database.

We connected to mongo using

(async function connectMongoDb() {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`Mongo connection success at ${mongoUrl}`);
    } catch (err) {
        console.log(err);
    }
})();

This is an IIFE for this use case. Now since a database of mongo has collections/tables and a collection
needs a schema therefore we create a schema for our users. Schema is made using mongoose.Schema.

Now after schema is created we need to create a collection or a model, for this we use

const User = mongoose.model("User", userSchema);

and lets call this collection as User and pass user schema to it.

Now for:

/user: get all users we can use a mongo method i,e find so we have used let users = await User.find({});

/user/:userId i,e get user by id we can use findById method so we used  await User.findById(id);

/user i,e post a new user we can use Create i,e User.create(req.body);

/user/:userId put, i,e update user by id we can use const resp = await User.findByIdAndUpdate(req.params.userId, req.body);

/user/:userId delete i,e delete user by id we can use const resp = await User.findByIdAndDelete(req.params.userId);





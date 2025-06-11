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


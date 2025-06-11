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





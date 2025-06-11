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



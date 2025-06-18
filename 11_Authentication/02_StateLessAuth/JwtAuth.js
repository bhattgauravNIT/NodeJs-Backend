import express from "express";
import mongoose from "mongoose";
import crypto from 'crypto';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";


const app = express();
const dbName = "Authentication";
const mongoUrl = `mongodb://127.0.0.1:27017/${dbName}`;
const secretKey = "GauravBhatt123$"

app.use(express.json());
app.use(cookieParser());

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
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
 * Sign up new user
 * 
 */
app.post('/signUp', async (req, res) => {
    try {
        console.log('Initiating signup for users');
        let users = await User.create(req.body)
        res.status(200).json(users);
    } catch (err) {
        console.log('Oops something wrong in while signing up');
        res.status(500).json("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log('Initiating sign in');
        const { email, password } = req.body;
        let user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        const token = jwt.sign(req.body, secretKey);
        return res.cookie("token", token).status(200).json("logged in successfully")
    } catch (err) {
        console.log('Oops something wrong in logging in');
        res.status(500).json("Internal server error");
    }
})

app.get('/users', async (req, res) => {
    try {
        console.log('Initiating get users');
        const token = req.cookies['token'];
        if (!jwt.verify(token, secretKey)) {
            return res.status(401).json({ error: "Session expired or invalid" });
        }
        let user = await User.find({});
        return res.status(200).json({ user });
    } catch (err) {
        console.log('Oops something wrong getting users');
        res.status(500).json("Internal server error");
    }
})
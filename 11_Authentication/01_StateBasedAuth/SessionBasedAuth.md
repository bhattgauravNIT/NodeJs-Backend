A client makes a request to a server, there can be two ways in this we can perform authentication of this client.

Stateful authentication:

In stateful authentication the server maintains a state or some data like a session id which it send back to browser, this is then used to maintain the session of the user. Such type of authentication is termed as stateful authentication.

The server can send back the state back to the client via cookies or headers or json response.

a) Cookies:

Once User logs in Server verifies the credentials and Generates a session ID this session id is stored on data server-side (e.g., in memory, Redis, DB). Server sends the session ID back to the client via an HTTP Set-Cookie header. The browser stores this cookie as and automatically includes it in future requests as header to the request.

Now Server reads the cookie, looks up the session using the session ID, and authenticates the request.

Cookies can be of two types:

1. Persistent Cookies (have an expiry time)

These cookies are having an expiry and is Stored even after browser closes. These automatically expire after the defined time or if the user clears
them manually.

Set-Cookie: session_id=abc123; Max-Age=3600


1. Session Cookies (expire when browser closes)

These cookies don't have an expiry and is removed when Browser is closed or System restarts

Default type if Expires/Max-Age is not set


Lets understand how cookie based authentication works with help of a code:

```javascript
import express from "express";
import mongoose from "mongoose";
import crypto from 'crypto';
import cookieParser from "cookie-parser";

const app = express();
const dbName = "Authentication";
const mongoUrl = `mongodb://127.0.0.1:27017/${dbName}`;
const sessionMap = new Map();

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
        const sessionId = crypto.randomUUID();
        sessionMap.set(sessionId, email);
        return res.cookie("session-id", sessionId).status(200).json("logged in successfully")
    } catch (err) {
        console.log('Oops something wrong in logging in');
        res.status(500).json("Internal server error");
    }
})

app.get('/users', async (req, res) => {
    try {
        console.log('Initiating get users');
        const sessionId = req.cookies['session-id'];
        if (!sessionMap.has(sessionId)) {
            return res.status(401).json({ error: "Session expired or invalid" });
        }
        let user = await User.find({});
        return res.status(200).json({ user });
    } catch (err) {
        console.log('Oops something wrong getting users');
        res.status(500).json("Internal server error");
    }
})
```

Lets understand this Cookie based authentication and authorization.

So initially a new user signs up in our application so it gets sent to /signUp api on post.
We stored the user's userName, password and email.

Now when this user tries to login in via /login on post first we check wether the user exists in the db or not
so its username and password gets validated i,e using 

let user = await User.findOne({ email, password });

Now if the user is found then we generate its session id using crypto.randomUUID() which is an inbuilt
package of node js.

This session id against the user can now be stored in a local cache or db, this cookie can be a persistent cookie
as well. In this case we made a simple cookie and stored it in a local cache i,e a map. Now an entry exists in a map.

This cookie can be seen in the headers of the request sent every time by the client by default.
Now when the user request for /users on get, since the map contains the session id therefore we know that users current
session is active and thus we allow this request, however if we restart the server then map gets empty (as specific in this case the way we have written the code), thus the session id is not found and there fore the user has to login again.
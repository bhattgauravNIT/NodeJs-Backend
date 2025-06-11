import mongoose from "mongoose";

async function connectMongoDb(mongoUrl) {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`Mongo connection success at ${mongoUrl}`);
    } catch (err) {
        console.log(err);
    }
};

export default {
    connectMongoDb
};
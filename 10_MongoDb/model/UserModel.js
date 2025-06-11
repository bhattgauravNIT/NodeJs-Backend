import mongoose from "mongoose";

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

export default {
    User
};
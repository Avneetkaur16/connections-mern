import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    username: { type: String, unique: true, required: true, min: 6, max: 16 },
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    password: { type: String, required: true, min: 8, max: 20 },
    email: { type: String, required: true },
    profilePic: { type: String, default: '' },
    coverPic: { type: String, default: '' },
    city: { type: String },
    institute: { type: String },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] }

}, { timestamps: true });

export default mongoose.model('User', UserSchema);
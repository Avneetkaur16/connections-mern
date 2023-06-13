import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    text: { type: String, max: 550 },
    image: { type: String },
    likes: { type: Array, default: [] },

}, { timestamps: true });

export default mongoose.model('Post', PostSchema);
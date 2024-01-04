import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import path from 'path';
import { URL } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';


const app = express();
dotenv.config();
const __dirname = decodeURI(new URL('.', import.meta.url).pathname);


const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Database Connected')
    } catch (error) {
        throw error
    }
}

app.use(express.json());
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


// Static files
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(process.env.PORT || 9000, () => {
    connect();
    console.log(`Server started on port ${process.env.PORT || 9000}`)
})

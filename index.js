

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import createError from './utils/appError.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
app.use('/api/auth', authRouter);

// MONGODB CONNECTION
// const dbURI = process.env.MONGODB_URI;
mongoose.connect('mongodb+srv://anshika:anshi123@cluster1.cqsvo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Test route
app.get("/", (req, res) => {
    res.send("Working");
});

export default app; // This is crucial for Vercel

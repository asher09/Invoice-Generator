import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";


const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
    mongoose.connect(DATABASE_URL);
} else {
    console.error('DATABASE_URL not found');
}



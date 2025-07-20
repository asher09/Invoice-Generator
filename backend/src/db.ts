import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";


export async function connectDB() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    mongoose.connect(DATABASE_URL!);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

connectDB();
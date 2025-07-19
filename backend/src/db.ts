import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {

    if(isConnected) return;
    const DATABASE_URL = process.env.DATABASE_URL;
    if(!DATABASE_URL) throw new Error('DATABASE_URL not set')
    await mongoose.connect(DATABASE_URL!);
    isConnected = true;

  }


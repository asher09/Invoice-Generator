import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

export async function connectDB() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;

    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    await mongoose.connect(DATABASE_URL);

    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

connectDB();
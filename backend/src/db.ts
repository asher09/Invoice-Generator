import mongoose from "mongoose";

export async function connectToDatabase(): Promise<void> {
  try {
    const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/invoice-generator';
    
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}


connectToDatabase();

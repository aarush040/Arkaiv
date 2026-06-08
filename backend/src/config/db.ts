import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://localhost:27017/arkaiv';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[DB] MongoDB connected successfully');
  } catch (error: any) {
    console.warn('[DB] MongoDB connection failed:', error.message);
    console.warn('[DB] Server will run without database. Set MONGODB_URI in .env to connect.');
  }
}

export default connectDB;
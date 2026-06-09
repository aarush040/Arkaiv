import mongoose from 'mongoose';

/**
 * Tracks whether MongoDB is currently connected.
 * Other modules can check `isMongoConnected()` before running queries
 * to avoid the 10 s buffering timeout that occurs when Mongoose tries
 * to queue operations while the driver is disconnected.
 */
let _connected = false;

export function isMongoConnected(): boolean {
  return _connected;
}

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB] MONGODB_URI is not set. Server will run without database.');
    return;
  }

  try {
    await mongoose.connect(uri);
    _connected = true;
    console.log('[DB] MongoDB connected successfully');
  } catch (error: any) {
    _connected = false;
    console.error('[DB] MongoDB connection failed:', error.message);
    // Re-throw so the caller can decide whether to abort startup.
    throw error;
  }

  // React to runtime disconnections (network blip, Atlas failover, etc.)
  mongoose.connection.on('disconnected', () => {
    _connected = false;
    console.warn('[DB] MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    _connected = true;
    console.log('[DB] MongoDB reconnected');
  });
}

export default connectDB;
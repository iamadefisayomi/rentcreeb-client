import mongoose from 'mongoose';

let isConnected = false;
const MAX_RETRIES = 5;

export async function dbConnection(retries = 0): Promise<void> {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    const db = await mongoose.connect(mongoUri);
    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log('MongoDB connected successfully.');
    } else {
      throw new Error('MongoDB connection not ready.');
    }
  } catch (err: any) {
    console.error(`MongoDB connection failed. Attempt ${retries + 1}/${MAX_RETRIES}`);
    console.error('Error:', err.message);

    if (retries < MAX_RETRIES) {
      const delay = Math.pow(2, retries) * 1000; // Exponential backoff
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise((res) => setTimeout(res, delay));
      return dbConnection(retries + 1);
    } else {
      console.error('All retry attempts to connect to MongoDB failed.');
      throw new Error(err.message || 'Database connection failed');
    }
  }
}

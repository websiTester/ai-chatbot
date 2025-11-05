import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
// Extend the global object to include mongoose
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}

// Initialize global mongoose if not already defined
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function dbConnect() {
  if (global.mongoose && global.mongoose.conn) {
    console.log('✅ Connected from previous');
    return global.mongoose.conn;
  } else {
    const conString = process.env.MONGODB_URI;
    
    if (!conString) {
      throw new Error('❌ MONGODB_URI environment variable is not defined');
    }
    try {
      const promise = mongoose.connect(conString, {
        autoIndex: true,
        serverSelectionTimeoutMS: 10000, // 10 second timeout
      });

      global.mongoose = {
        conn: await promise,
        promise,
      };

      console.log('✅ Successfully connected to MongoDB!');
      return await promise;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:');
    }
  }
}

// Test the connection
async function testConnection() {
  try {
    await dbConnect();
    console.log('🎉 Database connection test completed successfully!');

  } catch (error) {
    console.error('💥 Database connection test failed!');
    console.error(error instanceof Error ? error.message : String(error));
  }
}


import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
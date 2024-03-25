import mongoose from "mongoose";

export const MONGODB_URI = "mongodb://localhost:27017/myuser";

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1); // Exit with failure status
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Try to reconnect
db.on('reconnected', () => {
  console.log('MongoDB reconnected');
});





export { db };

import express from "express";
import userRoutes from "./routes/userRoutes";
import { db, MONGODB_URI } from "./config/database";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";
/**
 * Initializes Express app and connects to MongoDB database.
 * Exports app and db instances.
 */
mongoose.connect(MONGODB_URI);

const app = express();

  app.use(express.json());
  
  db.once("open", () => {
    console.log(`MongoDB connected to ${MONGODB_URI}`);
  });
  
  // Routes
  app.use(userRoutes);
  
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
  
  app.use(errorHandler);
  
export default app;
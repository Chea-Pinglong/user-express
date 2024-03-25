// src/routes/userRoutes.ts
import express from "express";
/**
 * Defines Express routes for user management.
 */

import {
  getUsers,
  getUserById,
  updateUserById,
  createUser,
  deleteUserById,
} from "../controllers/userController";


const app = express.Router();

// CRUD routes
app.get("/", getUsers);
app.get("/:id", getUserById);
app.post("/", createUser);
app.put("/:id", updateUserById);
app.delete("/:id", deleteUserById);


export default app;

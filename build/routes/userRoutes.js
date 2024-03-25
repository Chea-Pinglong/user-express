"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
/**
 * Defines Express routes for user management.
 */
const userController_1 = require("../controllers/userController");
const app = express_1.default.Router();
// CRUD routes
app.post("/", userController_1.createUser);
app.get("/", userController_1.getUsers);
app.get("/:id", userController_1.getUserById);
app.put("/:id", userController_1.updateUserById);
app.delete("/:id", userController_1.deleteUserById);
exports.default = app;

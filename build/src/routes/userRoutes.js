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
const userController = new userController_1.UserController();
// CRUD routes
// app.get("/", userController.getUsers);
// app.get("/:id", userController.getUserById);
app.post("/", userController.createUser);
// app.put("/:id", userController.updateUserById);
// app.delete("/:id", userController.deleteUserById);
exports.default = app;
//# sourceMappingURL=userRoutes.js.map
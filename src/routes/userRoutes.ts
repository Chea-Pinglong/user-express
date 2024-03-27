// src/routes/userRoutes.ts
import express, { NextFunction, Request } from "express";
import validateInput from "../middlewares/validateInput";
// import { SIGNUP_ROUTE } from "./route-defs";
import { UserSchema } from "../schema/userSchema";
import { UserController } from "../controllers/userController";

const app = express.Router();

const userController = new UserController();

// CRUD routes
app.get("/", async (req: Request, res, _next) => {
  try {
    const response = await userController.getUsers();

    return res.send(response);
  } catch (error) {
    _next(error);
  }
});

// app.get("/:id", userController.getUserById);
// app.post("/", userController.createUser);

app.post("/", validateInput(UserSchema), async (req: Request, res, _next) => {
  try {
    const requestBody = req.body;
    const response = await userController.createUser(requestBody);

    return res.send(response);
  } catch (error) {
    _next(error);
  }
});
// app.put("/:id", userController.updateUserById);
// app.delete("/:id", userController.deleteUserById);

export default app;

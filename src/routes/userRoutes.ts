import express, { NextFunction, Request } from "express";
import validateInput from "../middlewares/validateInput";
import { UserSchema } from "../schema/userSchema";
import { UserController } from "../controllers/userController";

const app = express.Router();

const userController = new UserController();

// CRUD routes
app.get("/user", async (req: Request, res, _next) => {
  try {
    const response = await userController.getUsers();
    return res.send(response);
  } catch (error) {
    _next(error);
  }
});

app.get("/user/:id", async (req: Request, res, _next) => {
  try {
    const requestId = req.params.id;
    const response = await userController.getUserById(requestId);
    if(!response){
      res.status(404).send("User not found")
    }
    return res.send(response);
  } catch (error) {
    _next(error);
  }
});

app.post("/user", validateInput(UserSchema), async (req: Request, res, _next) => {
  try {
    const requestBody = req.body;
    const response = await userController.createUser(requestBody);
    return res.send(response);
  } catch (error) {
    _next(error);
  }
});

app.put("/user/:id", validateInput(UserSchema), async(req: Request, res,_next)=>{
  try {
    const requestId = req.params.id
    const requestBody = req.body

    const response = await userController.updateUserById(requestId, requestBody)
    return res.send(response)
  } catch (error) {
    _next(error)
  }
})


export default app;

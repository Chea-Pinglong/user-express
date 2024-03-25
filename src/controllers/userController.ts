import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import User from "../models/user";
import crypto from "crypto";
import { hashPassword } from "../services/auth";
import {
  createUserSchema,
  updateUserSchema,
} from "../middlewares/validationSchemas";
import { NotFoundError, DuplicateError } from "../middlewares/errorHandler";
import moment from "moment";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const { name, dateOfBirth, email, password } = parsed;

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new DuplicateError("Email must be unique");
    }

    // Format dateOfBirth
    const formattedDateOfBirth = moment(dateOfBirth).format("DD-MMM-YYYY");

    // Create the new user
    const newUser = new User({
      name,
      dateOfBirth: formattedDateOfBirth,
      email,
      password: hashedPassword,
    });

    // Save the new user
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => {
        let message = "";

        switch (issue.path[0]) {
          case "name":
            message = "Name is required";
            break;
          case "email":
            message = "Invalid email";
            break;
          // etc for other fields

          default:
            message = issue.message;
        }

        return `${issue.path[0]} ${message}`;
      });

      res.status(400).send({
        message: formattedErrors,
      });
    }
    next(error);
  }
};

// Get all users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    // const user =  users.find((user) => user.id === id);
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user by ID
const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    // validae input
    const parsed = updateUserSchema.parse(req.body);
    const { name, dateOfBirth, email, password } = parsed;

    // Hash the password
    const hashedPassword = password
      ? crypto.createHash("sha256").update(password).digest("hex")
      : undefined;

    // Format dateOfBirth
    const formattedDateOfBirth = moment(dateOfBirth).format("DD-MMM-YYYY");

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        dateOfBirth: formattedDateOfBirth,
        email,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!updateUser) {
      throw new NotFoundError("User not found");
    }

    res.json(updateUser);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => {
        let message = "";

        switch (issue.path[0]) {
          case "name":
            message = "is required";
            break;
          case "email":
            message = "Invalid";
            break;
          case "password":
            message = "should be more than 6 digits";
            break;
          // etc for other fields

          default:
            message = issue.message;
        }

        return `${issue.path[0]} ${message}`;
      });

      res.status(400).send({
        message: formattedErrors,
      });
      // etc for other fields
    }
    next(error);
  }
};

// Delete user by ID
const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    // const userIndex = users.findIndex((user) => user.id === id);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundError("User not found");
    }

    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};

export { createUser, getUsers, getUserById, updateUserById, deleteUserById };

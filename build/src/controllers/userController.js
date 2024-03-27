"use strict";
// import { NextFunction, Request, Response } from "express";
// import { ZodError } from "zod";
// import User from "../models/user";
// import crypto from "crypto";
// import { hashPassword } from "../services/auth";
// import {
//   createUserSchema,
//   updateUserSchema,
// } from "../middlewares/validationSchemas";
// import { NotFoundError, DuplicateError } from "../middlewares/errorHandler";
// import moment from "moment";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const parsed = createUserSchema.parse(req.body);
//     const { name, dateOfBirth, email, password } = parsed;
//     // Hash the password
//     const hashedPassword = hashPassword(password);
//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw new DuplicateError("Email must be unique");
//     }
//     // Format dateOfBirth
//     const formattedDateOfBirth = moment(dateOfBirth).format("DD-MMM-YYYY");
//     // Create the new user
//     const newUser = new User({
//       name,
//       dateOfBirth: formattedDateOfBirth,
//       email,
//       password: hashedPassword,
//     });
//     // Save the new user
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const formattedErrors = error.issues.map((issue) => {
//         let message = "";
//         switch (issue.path[0]) {
//           case "name":
//             message = "Name is required";
//             break;
//           case "email":
//             message = "Invalid email";
//             break;
//           // etc for other fields
//           default:
//             message = issue.message;
//         }
//         return `${issue.path[0]} ${message}`;
//       });
//       res.status(400).send({
//         message: formattedErrors,
//       });
//     }
//     next(error);
//   }
// };
// // Get all users
// const getUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     next(error);
//   }
// };
// // Get user by ID
// const getUserById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id;
//     // const user =  users.find((user) => user.id === id);
//     const user = await User.findById(id);
//     if (!user) {
//       throw new NotFoundError("User not found");
//     }
//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// };
// // Update user by ID
// const updateUserById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const id = req.params.id;
//     // validae input
//     const parsed = updateUserSchema.parse(req.body);
//     const { name, dateOfBirth, email, password } = parsed;
//     // Hash the password
//     const hashedPassword = password
//       ? crypto.createHash("sha256").update(password).digest("hex")
//       : undefined;
//     // Format dateOfBirth
//     const formattedDateOfBirth = moment(dateOfBirth).format("DD-MMM-YYYY");
//     const updateUser = await User.findByIdAndUpdate(
//       id,
//       {
//         name,
//         dateOfBirth: formattedDateOfBirth,
//         email,
//         password: hashedPassword,
//       },
//       { new: true }
//     );
//     if (!updateUser) {
//       throw new NotFoundError("User not found");
//     }
//     res.json(updateUser);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const formattedErrors = error.issues.map((issue) => {
//         let message = "";
//         switch (issue.path[0]) {
//           case "name":
//             message = "is required";
//             break;
//           case "email":
//             message = "Invalid";
//             break;
//           case "password":
//             message = "should be more than 6 digits";
//             break;
//           // etc for other fields
//           default:
//             message = issue.message;
//         }
//         return `${issue.path[0]} ${message}`;
//       });
//       res.status(400).send({
//         message: formattedErrors,
//       });
//       // etc for other fields
//     }
//     next(error);
//   }
// };
// // Delete user by ID
// const deleteUserById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const id = req.params.id;
//     // const userIndex = users.findIndex((user) => user.id === id);
//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser) {
//       throw new NotFoundError("User not found");
//     }
//     res.json(deletedUser);
//   } catch (error) {
//     next(error);
//   }
// };
// export { createUser, getUsers, getUserById, updateUserById, deleteUserById };
// controllers/UserController.ts
const tsoa_1 = require("tsoa");
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../services/auth");
const errorHandler_1 = require("../middlewares/errorHandler");
const moment_1 = __importDefault(require("moment"));
const zod_1 = require("zod");
let UserController = class UserController extends tsoa_1.Controller {
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, dateOfBirth, email, password } = requestBody;
                // Hash the password
                const hashedPassword = (0, auth_1.hashPassword)(password);
                // Check if the email already exists
                const existingUser = yield user_1.default.findOne({ email });
                if (existingUser) {
                    throw new errorHandler_1.DuplicateError("Email must be unique");
                }
                // Format dateOfBirth
                const formattedDateOfBirth = (0, moment_1.default)(dateOfBirth).format("DD-MMM-YYYY");
                // Create the new user
                const newUser = new user_1.default({
                    name,
                    dateOfBirth: formattedDateOfBirth,
                    email,
                    password: hashedPassword,
                });
                // Save the new user
                const savedUser = yield newUser.save();
                return savedUser;
            }
            catch (error) {
                this.setStatus(400);
                if (error instanceof zod_1.ZodError) {
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
                    throw new Error(formattedErrors.join(', '));
                }
                throw error;
            }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)('users')
], UserController);
//# sourceMappingURL=userController.js.map
"use strict";
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
exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const zod_1 = require("zod");
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("../services/auth");
const validationSchemas_1 = require("../middlewares/validationSchemas");
const errorHandler_1 = require("../middlewares/errorHandler");
const moment_1 = __importDefault(require("moment"));
/**
 * Creates a new user.
 *
 * Validates user data against schema.
 * Hashes password.
 * Checks for duplicate email.
 * Formats date of birth.
 * Saves new user to DB.
 * Handles validation errors.
 * Handles duplicate email error.
 * Passes other errors to error handler middleware.
 */
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = validationSchemas_1.createUserSchema.parse(req.body);
        const { name, dateOfBirth, email, password } = parsed;
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
        res.status(201).json(savedUser);
    }
    catch (error) {
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
            res.status(400).send({
                message: formattedErrors,
            });
        }
        next(error);
    }
});
exports.createUser = createUser;
// Get all users
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
// Get user by ID
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // const user =  users.find((user) => user.id === id);
        const user = yield user_1.default.findById(id);
        if (!user) {
            throw new errorHandler_1.NotFoundError("User not found");
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
// Update user by ID
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // validae input
        const parsed = validationSchemas_1.updateUserSchema.parse(req.body);
        const { name, dateOfBirth, email, password } = parsed;
        // Hash the password
        const hashedPassword = password
            ? crypto_1.default.createHash("sha256").update(password).digest("hex")
            : undefined;
        // Format dateOfBirth
        const formattedDateOfBirth = (0, moment_1.default)(dateOfBirth).format("DD-MMM-YYYY");
        const updateUser = yield user_1.default.findByIdAndUpdate(id, {
            name,
            dateOfBirth: formattedDateOfBirth,
            email,
            password: hashedPassword,
        }, { new: true });
        if (!updateUser) {
            throw new errorHandler_1.NotFoundError("User not found");
        }
        res.json(updateUser);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
});
exports.updateUserById = updateUserById;
// Delete user by ID
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // const userIndex = users.findIndex((user) => user.id === id);
        const deletedUser = yield user_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new errorHandler_1.NotFoundError("User not found");
        }
        res.json(deletedUser);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserById = deleteUserById;

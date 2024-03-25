"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middlewares/errorHandler");
/**
 * Initializes Express app and connects to MongoDB database.
 * Exports app and db instances.
 */
const app = (0, express_1.default)();
app.use(express_1.default.json());
database_1.db.once("open", () => {
    console.log(`MongoDB connected to ${database_1.MONGODB_URI}`);
});
// Routes
app.use(userRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
app.use(errorHandler_1.errorHandler);
exports.default = app;

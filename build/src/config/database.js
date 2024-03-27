"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.MONGODB_URI = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.MONGODB_URI = "mongodb://localhost:27017/myuser";
mongoose_1.default.connect(exports.MONGODB_URI);
const db = mongoose_1.default.connection;
exports.db = db;
db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit with failure status
});
db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
// Try to reconnect
db.on('reconnected', () => {
    console.log('MongoDB reconnected');
});
//# sourceMappingURL=database.js.map
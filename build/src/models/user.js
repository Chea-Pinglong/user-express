"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// Define a virtual property 'age' based on 'dateOfBirth'
userSchema.virtual("age").get(function () {
    const currentDate = (0, moment_1.default)();
    const birthDate = (0, moment_1.default)(this.dateOfBirth);
    return currentDate.diff(birthDate, "years");
});
// Ensure virtual fields are included when converting document to JSON
userSchema.set("toJSON", { virtuals: true });
// Middleware to update 'age' field before saving/updating document
userSchema.pre("save", function (next) {
    this.age = (0, moment_1.default)().diff((0, moment_1.default)(this.dateOfBirth), "years");
    next();
});
// Middleware to update 'age' field after findOneAndUpdate operation
userSchema.post("findOneAndUpdate", function (doc) {
    if (doc) {
        const currentDate = (0, moment_1.default)();
        const birthDate = (0, moment_1.default)(doc.dateOfBirth);
        doc.age = currentDate.diff((0, moment_1.default)(birthDate), "years");
    }
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.js.map
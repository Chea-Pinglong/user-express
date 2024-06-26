"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Hashes the given password using SHA-256.
 *
 * @param password - The password to hash.
 * @returns The hashed password as a hex string.
 */
const hashPassword = (password) => {
    return crypto_1.default.createHash("sha256").update(password).digest("hex");
};
exports.hashPassword = hashPassword;

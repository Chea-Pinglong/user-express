"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.NotFoundError = exports.DuplicateError = void 0;
class DuplicateError extends Error {
    /**
     * Extends the base Error class to create a custom DuplicateError error.
     * This can be used to identify duplicate errors and handle them separately.
     * The constructor sets the name to "DuplicateError" for identification.
     */
    constructor(message) {
        super(message);
        this.name = "DuplicateError";
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(`An error occurred: ${err.message}`);
    // console.error(err.stack);
    let statusCode = 500;
    if (err instanceof SyntaxError) {
        statusCode = 400;
    }
    else if (err instanceof DuplicateError) {
        statusCode = 409;
    }
    else if (err instanceof NotFoundError) {
        statusCode = 404;
    }
    res.status(statusCode).json({ message: err.message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
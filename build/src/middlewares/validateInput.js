"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateInput = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next(error);
            }
            next(error);
        }
    };
};
exports.default = validateInput;
//# sourceMappingURL=validateInput.js.map
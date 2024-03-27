import { StatusCode } from "../utils/statusCode";
import { SerializedErrorOutput } from "./@types/serializedErrorOutput";
import CustomError from "./customError";

// 1. Unexpected Server Error
// 2. Fallback Error handler
// 3. Server Error

export default class APIError extends CustomError {
    constructor(
        message: string,
        statusCode: number = StatusCode.InternalServerError
    ){
        super(message, statusCode);
        Object.setPrototypeOf(this,APIError.prototype);
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    serializeErrorOutput(): SerializedErrorOutput {
        return {
            errors: [{message: this.message}]
        }
    }
}

import { ZodError } from "zod";
import { StatusCode } from "../utils/statusCode";
import { SerializedErrorOutput } from "./@types/serializedErrorOutput";
import CustomError from "./customError";

export default class InvalidInputError extends CustomError{
    private readonly errors: ZodError;

    constructor(errors:ZodError){
        super("Invalid Input", StatusCode.BadRequest);
        this.errors = errors;
        Object.setPrototypeOf(this,InvalidInputError.prototype);
    }

    getStatusCode(): number {
        return this.statusCode;
    }
    
    serializeErrorOutput():SerializedErrorOutput {
        return {
            errors: this.errors.errors
        }
    }
}
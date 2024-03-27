import { StatusCode } from "../utils/statusCode";
import { SerializedErrorOutput } from "./@types/serializedErrorOutput";
import CustomError from "./customError";

export default class DuplicateError extends CustomError {
    constructor(message: string){
        super(message, StatusCode.Conflict);
        Object.setPrototypeOf(this,DuplicateError.prototype);
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
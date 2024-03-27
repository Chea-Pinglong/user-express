import { SerializedErrorOutput } from "./@types/serializedErrorOutput";
import CustomError from "./customError";

export default class MockCustomError extends CustomError{
    constructor(message: string, statusCode: number){
        super(message, statusCode);
        Object.setPrototypeOf(this,MockCustomError.prototype);
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
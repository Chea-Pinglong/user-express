import { SerializedErrorOutput } from "./@types/serializedErrorOutput";

export default abstract class CustomError extends Error {
    protected statusCode: number;

    protected constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract getStatusCode(): number;
    abstract serializeErrorOutput(): SerializedErrorOutput;
}
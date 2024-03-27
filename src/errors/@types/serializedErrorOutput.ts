export type SerializedErrorOutput = {
    errors: SerializedError[];
}

export type SerializedError = {
    message: string;
    field?: SerializedErrorField;
}

export type SerializedErrorField = {
    [key: string]: string[];
}
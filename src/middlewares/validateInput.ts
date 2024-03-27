import {Request, Response, NextFunction} from "express";
import { ZodSchema, ZodError } from "zod";
import InvalidInputError from "../errors/invalidInputError";

const validateInput = (schema: ZodSchema)=>{
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            schema.parse(req.body);
            next()
        }catch(error: unknown) {
            if(error instanceof ZodError) {
                return next(new InvalidInputError(error))
            }
            next(error)
        }
    }
}

export default validateInput;
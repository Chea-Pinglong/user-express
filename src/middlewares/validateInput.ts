import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";           
const validateInput = (schema: ZodSchema) =>{
    return(req: Request, res: Response,next: NextFunction)=>{
        try{
            schema.parse(req.body);
            next();
        }catch(error: unknown) {
            if(error instanceof ZodError){
                return next(error);
            }
            next(error);
        }
    }
}

export default validateInput;
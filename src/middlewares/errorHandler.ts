
// export class DuplicateError extends Error {
//   /**
//    * Extends the base Error class to create a custom DuplicateError error.
//    * This can be used to identify duplicate errors and handle them separately.
//    * The constructor sets the name to "DuplicateError" for identification.
//    */
//   constructor(message: string) {
//     super(message);
//     this.name = "DuplicateError";
//   }
// }

// export class NotFoundError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "NotFoundError";
//   }
// }
// Error handling middleware

import {Request, Response, NextFunction} from "express";
import CustomError from "../errors/customError";
import { StatusCode } from "../utils/statusCode";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // If the error is an instance of our own throw ERROR
  if (err instanceof CustomError) {
    return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
  }

  return res
    .status(StatusCode.InternalServerError)
    .json({ errors: [{ message: "An unexpected error occurred" }] });
};

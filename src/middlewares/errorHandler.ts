import { Request, Response, NextFunction } from "express";

export class DuplicateError extends Error {
  /**
   * Extends the base Error class to create a custom DuplicateError error.
   * This can be used to identify duplicate errors and handle them separately.
   * The constructor sets the name to "DuplicateError" for identification.
   */
  constructor(message: string) {
    super(message);
    this.name = "DuplicateError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`An error occurred: ${err.message}`);
  // console.error(err.stack);

  let statusCode = 500;

  if (err instanceof SyntaxError) {
    statusCode = 400;
  } else if (err instanceof DuplicateError) {
    statusCode = 409;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
  }
  res.status(statusCode).json({ message: err.message });
};

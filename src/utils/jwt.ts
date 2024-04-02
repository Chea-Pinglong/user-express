import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import APIError from "../errors/apiError";

const salt = 10;

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new APIError("Unable to generate password");
  }
};

export const validatePassword = async ({
  enteredPassword,
  savedPassword,
}: {
  enteredPassword: string;
  savedPassword: string;
}) => {
  return (await hashPassword(enteredPassword)) === savedPassword;
};

export const generateSignature = async (payload: object): Promise<string> => {
  try {
    return await jwt.sign(payload, process.env.APP_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    throw new APIError("Unable to generate signature from jwt");
  }
};
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

import APIError from "../errors/apiError";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
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
  // const isPwdTrue = (await hashPassword(enteredPassword)) == savedPassword;
  // return isPwdTrue;
  const isPwdTrue = await bcrypt.compare(enteredPassword, savedPassword);

  return isPwdTrue
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

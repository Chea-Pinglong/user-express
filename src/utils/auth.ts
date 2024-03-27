import crypto from 'crypto';
import APIError from '../errors/apiError';

/**
 * Hashes the given password using SHA-256.
 *
 * @param password - The password to hash.
 * @returns The hashed password as a hex string.
 */
export const hashPassword = async (password: string) => {
  try{

    return await crypto.createHash("sha256").update(password).digest("hex");
  }catch(error){
    throw new APIError("Unable to generate password");
  }
};

export const validatePassword = async ({
  enteredPassword,
  savedPassword,
}:{
  enteredPassword: string;
  savedPassword: string
})=>{
  return (await hashPassword(enteredPassword)) === savedPassword;
}

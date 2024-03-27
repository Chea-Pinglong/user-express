import { UserCreateRepository } from "./@types/userRepository.type";
import DuplicateError from "../errors/duplicateError";
import APIError from "../errors/apiError";
import UserModel from "../models/user";

export default class UserRepository{
    async createUser({name, dateOfBirth, email, password}: UserCreateRepository){
        try {
            const existingUser = await this.FindUser({email})
            if (existingUser) {
                throw new DuplicateError("Email already exists");
              }

              const user = new UserModel({ name, email, password });
              const userResult = await user.save();
              return userResult;
        }catch (error){
            if (error instanceof DuplicateError) {
                throw error;
              }
              throw new APIError("Unable to create user in database");
        }
    }

    async FindUser({ email }: { email: string }) {
        try {
          const existingUser = await UserModel.findOne({ email: email });
          return existingUser;
        } catch (error) {
          return null;
        }
      }

      async FindUserById({ id }: { id: string }) {
        try {
          const existingUser = await UserModel.findById(id);
          return existingUser;
        } catch (error) {
          throw new APIError("Unable to find user by Id");
        }
      }
}
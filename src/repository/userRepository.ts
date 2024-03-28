import {
  UserCreateRepository,
  UserUpdateRepository,
} from "./@types/userRepository.type";
import DuplicateError from "../errors/duplicateError";
import APIError from "../errors/apiError";
import UserModel from "../models/user";

export default class UserRepository {
  async createUser({ name, email, password }: UserCreateRepository) {
    try {
      const existingUser = await this.checkEmail({ email });
      if (existingUser) {
        throw new DuplicateError("Email already exists");
      }

      const user = new UserModel({ name, email, password });
      const userResult = await user.save();
      return userResult;
    } catch (error) {
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new APIError("Unable to create user in database");
    }
  }

  async findAllUsers(page: number = 1, size: number = 5) {
    try {  
      const totalUsers = await UserModel.countDocuments({})

      const currPage = Math.max(1,Math.min(page, Math.ceil(totalUsers/size)))
      const totalPages = Math.ceil(totalUsers / size)
      const skip = (currPage - 1) * size
      const users = await UserModel.find({}, null, {skip, limit: size})
    
      // return {users, totalUsers};
      return { users, 
        pagination: {
        currPage, totalPages
      } 
    };
    } catch (error) {
      throw new APIError("Unable to fetch all user");
    }
  }

  async checkEmail({ email }: { email: string }) {
    try {
      const existingUser = await UserModel.findOne({ email: email });
      console.log(existingUser);
      return existingUser;
    } catch (error) {
      return null;
    }
  }

  async findUserById({ id }: { id: string }) {
    try {
      const existingUser = await UserModel.findById(id);
      return existingUser;
    } catch (error) {
      throw new APIError("Unable to find user by Id");
    }
  }

  async updateUserById({ id, ...updateData }: UserUpdateRepository) {
    try {
      const existingUser = await this.findUserById({ id });
      if (!existingUser) {
        throw new APIError("User not found");
      }

      existingUser.name = updateData.name || existingUser.name;
      existingUser.email = updateData.email || existingUser.email;
      existingUser.password = updateData.password || existingUser.password;

      const updatedUser = await existingUser.save();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserById({id}: {id: string}){
    try {
      const existingUser = await this.findUserById({id})
      if(!existingUser){
        throw new APIError("User not found")
      }

      await UserModel.findByIdAndDelete(id)
      return {message: "User delete successfully"}
    } catch (error) {
      throw error
    }
  }
  
}

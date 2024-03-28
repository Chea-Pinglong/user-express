import UserRepository from "../repository/userRepository";
import APIError from "../errors/apiError";
import { UserSchema } from "../schema/userSchema";
import { hashPassword } from "../utils/auth";
import { UserResult } from "./@types/user-service.type";
import { UserSchemaType } from "../schema/@types/user";

export default class UserService {
  private repo: UserRepository;

  constructor() {
    this.repo = new UserRepository();
  }

  async create(userType: UserSchemaType): Promise<UserResult> {
    try {
      const { name, email, password } = userType;
      const hashedPassword = await hashPassword(password);

      const newUser = await this.repo.createUser({
        name,
        email,
        password: hashedPassword,
      });
      return {
        user: newUser,
      };
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAll(){
    try {
      const users = await this.repo.findAllUsers()
     if(!users){
      return null
     }
     return {
      users
     }
    } catch (error) {
      throw error
    }
  }

  async getById(id: string): Promise<UserResult | null> {
    try {
      const user = await this.repo.findUserById({ id });
      if (!user) {
        return null;
      }
      return { user };
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    id: string,
    updates: Partial<UserSchemaType>
  ): Promise<UserResult> {
    try {
      const user = await this.getById(id);
      if (!user) {
        throw new APIError("User not found", 404);
      }

      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }

      const updatedUser = await this.repo.updateUserById({ id });
      return {
        user: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }
}

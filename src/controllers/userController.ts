import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Request,
  Body,
  Path,
} from "tsoa";
import User from "../models/user";
import APIError from "../errors/apiError";
// import
import UserService from "../services/user.service";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}
interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}
const userService = new UserService();

@Route("/user")
export class UserController extends Controller {
  @Post()
  public async createUser(
    @Body() requestBody: CreateUserRequest
  ): Promise<any> {
    try {
      const { name,  email, password } = requestBody;
      const newUser = await userService.create({
        name,
        email,
        password,
      });
      return newUser.user;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  public async getUsers(): Promise<any> {
    try {
      const users = await userService.getAll();
      return users;
    } catch (error) {
      this.setStatus(404);
    }
  }
  @Get(":id")
  public async getUserById(@Path("id") id: string): Promise<any | null> {
    try {
      return await userService.getById(id);
    } catch (error) {
      if (error instanceof APIError) {
        this.setStatus(404);
        return null;
      }
      throw error;
    }
  }
  @Put(":id")
  public async updateUserById(
    @Path("id") id: string,
    @Body() requestBody: UpdateUserRequest
  ): Promise<any> {
    try {
      const { name, email, password } = requestBody;
      const updateUser = await userService.updateById(id, {
        name,
        email,
        password,
      });
      return updateUser.user;
    } catch (error) {
      throw error;
    }
  }

  // Other controller methods (deleteUserById) can be similarly defined
}

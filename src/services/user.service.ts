import UserRepository from "../repository/userRepository";
import APIError from "../errors/apiError";
import { UserSchema } from "../schema/userSchema";
import { hashPassword } from "../utils/auth";
import { UserResult } from "./@types/user-service.type";
import { UserSchemaType } from "../schema/@types/user";

export default class UserService{
    private repo: UserRepository

    constructor(){
        this.repo = new UserRepository()
    }

    async create(userType: UserSchemaType): Promise<UserResult>{
        try{
            const {name, email, password, dateOfBirth} = userType

            const hashedPassword = await hashPassword(password)

            const newUser = await this.repo.createUser({
                name, 
                email,
                password: hashedPassword,
                dateOfBirth
            })
            return {
                user: newUser
            }
        }catch(error: unknown){
            throw error
        }
    }
}
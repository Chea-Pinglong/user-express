import AccountVerificationModel from "../models/account-verification.model";
import { AccountVerificationRepository } from "../repository/account-verification-repository";
import UserRepository from "../repository/user-repository";
import APIError from "../errors/apiError";
import DuplicateError from "../errors/duplicateError";
import {UserSignUpSchemaType,UserSignInSchemaType,} from "../schema/@types/user";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { StatusCode } from "../utils/statusCode";
import EmailSender from "../utils/email-sender";
import {hashPassword,generateSignature,validatePassword,} from "../utils/jwt";
import { UserSignUpParams, UserSignUpResult } from "./@types/user-service.type";

class UserService {
  private userRepo: UserRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  async SignUp(userDetails: UserSignUpParams): Promise<UserSignUpResult> {
    try {
      // const { email, password } = userDetails;

      // Convert User Password to Hash Password
      const hashedPassword = userDetails.password && (await hashPassword(userDetails.password));
      console.log("User Detail: ", userDetails.email)
 
      let newUserParams = {...userDetails}

      if (hashedPassword) {
        newUserParams = { ...newUserParams, password: hashedPassword };
      }
      // Save User to Database
      const newUser = await this.userRepo.CreateUser(newUserParams);
        console.log("New User: ", newUser)

      // Return Response 
      return newUser;
    } catch (error: unknown) {
      if (error instanceof DuplicateError) {
        const existedUser = await this.userRepo.FindUser({
          email: userDetails.email,
        });

        if (!existedUser?.isVerified) {
          // Resent the token
          await this.SendVerifyEmailToken({ userId: existedUser?._id });
          throw new APIError(
            "A user with this email already exists. Verification email resent."
          );
        }else if(existedUser.isVerified){
          throw new APIError("This email is already signed up. Go to login")
        }
        
      }
      throw error;
    }
  }

  async SendVerifyEmailToken({ userId }: { userId: string }) {
    try {
      // Step 1: generate verify token 
      const emailVerificationToken = generateEmailVerificationToken();
      
      const expired = new Date(new Date().getTime() + 60000)
      console.log("current time: ", new Date().toLocaleString())
      console.log("expired time: ", expired.toLocaleString())

      // Step 2: save the token to the database 
      const accountVerification = new AccountVerificationModel({userId, emailVerificationToken, expired});
      const newAccountVerification = await accountVerification.save();

      // Step 3: Get the info user by id
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new APIError("User does not exist!");
      }

      // Step 4: send the email to user 
      const emailSender = EmailSender.getInstance();
      emailSender.sendSignUpVerificationEmail({
        toEmail: existedUser.email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });
    } catch (error) {
      throw error;
    }
  }

  async VerifyEmailToken({ token }: { token: string }) {

    const now = new Date()

    const isTokenExist = await this.accountVerificationRepo.FindVerificationToken({ token });
    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }

    if(isTokenExist.expired < now){
      await this.accountVerificationRepo.DeleteVerificationToken({token})
      await this.SendVerifyEmailToken({userId: isTokenExist.userId.toString()})
      throw new APIError("Verification token has expired. A new verification is sent", StatusCode.BadRequest)
    }

    // Find the user associated with this token
    const user = await this.userRepo.FindUserById({
      id: isTokenExist.userId.toString(),
    });
    if (!user) {
      throw new APIError("User does not exist.", StatusCode.NotFound);
    }

    // Mark the user's email as verified
    user.isVerified = true;
    await user.save();

    // Remove the verification token
    await this.accountVerificationRepo.DeleteVerificationToken({ token });

    return user;
  }

  async Login(userDetails: UserSignInSchemaType) {
    // TODO:
    // 1. Find user by email
    // 2. Validate the password
    // 3. Generate Token & Return

    // Step 1
    const user = await this.userRepo.FindUser({ email: userDetails.email });

    if (!user) {
      throw new APIError("User not exist", StatusCode.NotFound);
    }

    // Step 2
    const isPwdCorrect = await validatePassword({
      enteredPassword: userDetails.password,
      savedPassword: user.password as string,
    });


    if (!isPwdCorrect) {
      throw new APIError(
        "Email or Password is incorrect",
        StatusCode.BadRequest
      );
    }

    // Step 3
    // const token = 
    await generateSignature({ userId: user._id });
    return {

    };
  }

  async FindUserByEmail({ email }: { email: string }) {
    try {
      const user = await this.userRepo.FindUser({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async UpdateUser({ id, updates }: { id: string; updates: object }) {
    try {
      const user = await this.userRepo.FindUserById({ id });
      if (!user) {
        throw new APIError("User does not exist", StatusCode.NotFound);
      }
      const updatedUser = await this.userRepo.UpdateUserById({ id, updates });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;

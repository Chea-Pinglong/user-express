import AccountVerificationModel from "../models/account-verification.model";
import { AccountVerificationRepository } from "../repository/account-verification-repository";
import UserRepository from "../repository/user-repository";
import APIError from "../errors/apiError";
import DuplicateError from "../errors/duplicateError";

import { UserSignUpSchemaType, UserSignInSchemaType } from "../schema/@types/user";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { StatusCode } from "../utils/statusCode";
import EmailSender from "../utils/email-sender";
import {
  hashPassword,
  generateSignature,
  validatePassword,
} from "../utils/jwt";
import { UserSignUpResult } from "./@types/user-service.type";

class UserService {
  private userRepo: UserRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  async SignUp(userDetails: UserSignUpSchemaType): Promise<UserSignUpResult> {
    try {
      const { email, password } = userDetails;

      // Convert User Password to Hash Password
      const hashedPassword = await hashPassword(password);

      // Save User to Database
      const newUser = await this.userRepo.CreateUser({
        email,
        password: hashedPassword,
      });

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
        }

        // Throw or handle the error based on your application's needs
        throw new APIError(
          "A user with this email already exists. Verification email resent."
        );
      }
      throw error;
    }
  }

  async SendVerifyEmailToken({ userId }: { userId: string }) {
    // TODO
    // 1. Generate Verify Token
    // 2. Save the Verify Token in the Database
    // 3. Get the Info User By Id
    // 4. Send the Email to the User

    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();

      // Step 2
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });
      const newAccountVerification = await accountVerification.save();

      // Step 3
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new APIError("User does not exist!");
      }

      // Step 4
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
    const isTokenExist =
      await this.accountVerificationRepo.FindVerificationToken({ token });

    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
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
      savedPassword: user.password,
    });

    if (!isPwdCorrect) {
      throw new APIError(
        "Email or Password is incorrect",
        StatusCode.BadRequest
      );
    }

    // Step 3
    const token = await generateSignature({ userId: user._id });

    return token;
  }
}

export default UserService;

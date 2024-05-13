import { IUserDocument } from "../../models/user.model";

export interface UserSignUpResult extends IUserDocument {}
export interface UserSignInResult extends IUserDocument {}

export interface UserSignUpParams {
    email: string;
    password?: string;
    isVerified?: boolean;
    googleId?: string;
  }
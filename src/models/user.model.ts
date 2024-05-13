import mongoose, { Document, Model } from "mongoose";

export interface IUser {
  email: string;
  // password: string;
  isVerified?: boolean;
}

export interface IUserDocument extends Document {
  email: string;
  password?: string;
  isVerified?: boolean;
  googleId?: string;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;

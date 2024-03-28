import mongoose, { Document, Model } from "mongoose";
import moment from "moment";
import { transform } from "typescript";
/**
 * User schema for MongoDB.
 * Defines the structure of a User document in the users collection.
 * Includes name, email, password hash, and date registered.
 */

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // delete ret.password;
        // delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export default UserModel;

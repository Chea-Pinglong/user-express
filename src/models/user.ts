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
  age?: number;
  dateOfBirth: Date;
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
    dateOfBirth: {
      type: Date,
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
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

// Define a virtual property 'age' based on 'dateOfBirth'
userSchema.virtual("age").get(function (this: IUserDocument) {
  const currentDate = moment();
  const birthDate = moment(this.dateOfBirth);
  return currentDate.diff(birthDate, "years");
});

// Ensure virtual fields are included when converting document to JSON
// userSchema.set("toJSON", { virtuals: true });

// Middleware to update 'age' field before saving/updating document
userSchema.pre<IUserDocument>("save", function (next) {
  this.age = moment().diff(moment(this.dateOfBirth), "years");
  next();
});

// Middleware to update 'age' field after findOneAndUpdate operation
userSchema.post<IUserDocument>(
  "findOneAndUpdate",
  function (doc: IUserDocument | null) {
    if (doc) {
      const currentDate = moment();
      const birthDate = moment(doc.dateOfBirth);
      doc.age = currentDate.diff(moment(birthDate), "years");
    }
  }
);
const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export default UserModel;

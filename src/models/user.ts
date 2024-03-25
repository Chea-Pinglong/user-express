
import mongoose, { Schema, Document } from "mongoose";
import moment from "moment";
/**
 * User schema for MongoDB.
 * Defines the structure of a User document in the users collection.
 * Includes name, email, password hash, and date registered.
 */

export interface UserDocument extends Document {
  name: string;
  age?: number;
  dateOfBirth: Date;
  email: string;
  password: string;
}

const userSchema: Schema<UserDocument> = new Schema({
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
});

// Define a virtual property 'age' based on 'dateOfBirth'
userSchema.virtual("age").get(function (this: UserDocument) {
  const currentDate = moment();
  const birthDate = moment(this.dateOfBirth);
  return currentDate.diff(birthDate, "years");
});

// Ensure virtual fields are included when converting document to JSON
userSchema.set("toJSON", { virtuals: true });

// Middleware to update 'age' field before saving/updating document
userSchema.pre<UserDocument>("save", function (next) {
  this.age = moment().diff(moment(this.dateOfBirth), "years");
  next();
});

// Middleware to update 'age' field after findOneAndUpdate operation
userSchema.post<UserDocument>(
  "findOneAndUpdate",
  function (doc: UserDocument | null) {
    if (doc) {
      const currentDate = moment();
      const birthDate = moment(doc.dateOfBirth);
      doc.age = currentDate.diff(moment(birthDate), "years");
    }
  }
);

export default mongoose.model<UserDocument>("User", userSchema);

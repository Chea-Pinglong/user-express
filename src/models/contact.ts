import mongoose, { Document, Model } from "mongoose";
import moment from "moment";
import { transform } from "typescript";
/**
 * Contact schema for MongoDB.
 * Defines the structure of a Contact document in the Contacts collection.
 * Includes name, email, password hash, and date registered.
 */

export interface IContactDocument extends Document {
  name: string;
  email: string;
  password: string;
}

export interface IContactModel extends Model<IContactDocument> {}

const ContactSchema = new mongoose.Schema(
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

const ContactModel = mongoose.model<IContactDocument, IContactModel>("Contact", ContactSchema);
export default ContactModel;

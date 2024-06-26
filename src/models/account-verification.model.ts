import mongoose, { Document, Model } from "mongoose";
import APIError from "../errors/apiError";

export interface IAccountVerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  emailVerificationToken: string;
  expired: Date;
}

export interface IAccountVerificationModel
  extends Model<IAccountVerificationDocument> {}

const accountVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  emailVerificationToken: {
    type: String,
    required: true,
    validate: (value: string): boolean => {
      if (!value || value.length !== 64) {
        throw new APIError("Invalid email verfication token");
      }
      return true;
    },
  },
  expired: {
    type: Date,
    required: true
  }
});

const AccountVerificationModel = mongoose.model<
  IAccountVerificationDocument,
  IAccountVerificationModel
>("AccountVerification", accountVerificationSchema);

export default AccountVerificationModel;

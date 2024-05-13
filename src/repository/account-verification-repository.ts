import APIError from "../errors/apiError";
import AccountVerificationModel from "../models/account-verification.model";

export class AccountVerificationRepository {
  async CreateVerificationToken({
    userId,
    token,
    expired,
  }: {
    userId: string;
    token: string;
    expired: Date;
  }) {
    try {
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken: token,
        expired,
      });

      const newAccountVerification = await accountVerification.save();
      return newAccountVerification;
    } catch (error) {
      throw error;
    }
  }

  async FindVerificationToken({ token }: { token: string }) {
    try {
      const existedToken = await AccountVerificationModel.findOne({
        emailVerificationToken: token,
      });

      return existedToken;
    } catch (error) {
      throw error;
    }
  }

  async DeleteVerificationToken({ token }: { token: string }) {
    try {
      await AccountVerificationModel.deleteOne({
        emailVerificationToken: token,
      });
    } catch (error) {
      throw error;
    }
  }

  async DeleteExpiredTokens() {
    const now = new Date();
    await AccountVerificationModel.deleteMany({ expired: { $lt: now } });
  }

}

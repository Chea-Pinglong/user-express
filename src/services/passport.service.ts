import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { PassportStatic } from "passport";
import UserRepository from "../repository/user-repository";

declare global {
  namespace Express {
    interface User {
      googleId?: string;
      // Other user properties as needed
    }
  }
}
export const authenticateUserWithOAuth = (passport: PassportStatic)=>{

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URL,
        passReqToCallback: true,
      },
      async (
        
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function
      ) => {
        try {
          const userRepository = new UserRepository()
          let user = await userRepository.FindUser({
            email: profile.email[0].value
          })
          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              await userRepository.UpdateUserById({
                id: profile.id,
                newInfo: { googleId: profile.id },
              });
            }
          }else{
            user = await userRepository.CreateUser({
              googleId: profile.id,
              email: profile.email[0].value,
            
            })
          }

         done(null, user);
        } catch (error) {
          done(error,null);
        }
      }
    )
  );
}

import UserService from "../services/user.service";
import {Route,Post,Body,Middlewares,SuccessResponse,Query,Get, Delete,} from "tsoa";
import validateInput from "../middlewares/validateInput";
import { IUser } from "../models/user.model";
import { UserSignInSchema, UserSignUpSchema } from "../schema/user-schema";
import { StatusCode } from "../utils/statusCode";
// import { ROUTE_PATHS } from "../routes/route-defs";
import { generateSignature } from "../utils/jwt";
import axios from "axios";

interface SignUpRequestBody {
  email: string;
  password: string;
}
interface LoginRequestBody {
  email: string;
  password: string;
}



const userService = new UserService();

@Route("auth")
export class AuthController {
  @SuccessResponse(StatusCode.Created, "Created")
  @Post("signup")
  @Middlewares(validateInput(UserSignUpSchema))
  public async SignUp(@Body() requestBody: SignUpRequestBody): Promise<IUser> {
    try {
      const { email, password } = requestBody;

      // Save User
      const newUser = await userService.SignUp({ email, password });

      // Send Email Verification
      await userService.SendVerifyEmailToken({ userId: newUser._id });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get("verify")
  public async VerifyEmail(@Query() token: string)
  // : Promise<{ message: string, token: string }> 
  {
    try {
      // Verify the email token
      const user = await userService.VerifyEmailToken({ token })

      // Generate JWT for the verified user
      // const jwtToken = await generateSignature({
      //   userId: user._id,
      // });

      return { message: "Verify success"};
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post("login")
  @Middlewares(validateInput(UserSignInSchema))
  public async Login(
    @Body() requestBody: LoginRequestBody
  )
  // : Promise<{ token: string }>
   {
    try {
      const { email, password } = requestBody;
      // const jwtToken = 
      await userService.Login({ email, password });

      // return {
      //   token: jwtToken,
      // };
      return {
        message: "Login success"
      }
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Delete("login")

  @SuccessResponse(StatusCode.OK, "OK")
  @Get("google")
  public async GoogleAuth(){
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    return {url}
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get("google/callback")
  public async GoogleAuthCallback(@Query() code: string) {
    try {
      // Exchange the code for tokens
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        clientId: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      });

      // Fetch user profile
      const profile = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }
      );

      const userService = new UserService();
      const existingUser = await userService.FindUserByEmail({
        email: profile.data.email,
      });

      if (existingUser) {
        // User Exists, link the Google account if it's not already linked
        if (!existingUser.googleId) {
          await userService.UpdateUser({
            id: existingUser._id,
            updates: { googleId: profile.data.id, isVerified: true },
          });
        }

        // Now, proceed to log the user in
        const jwtToken = await generateSignature({
          userId: existingUser._id,
        });

        return {
          token: jwtToken,
        };
      }

      // No user exists with this email, create a new user
      const newUser = await userService.SignUp({
        email: profile.data.email,
        isVerified: true,
        googleId: profile.data.id,
      });

      const jwtToken = await generateSignature({
        userId: newUser._id,
      });

      
      return {
        token: jwtToken,
      };
    } catch (error) {
      throw error;
    }
  }
}

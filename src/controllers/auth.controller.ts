import UserService from "../services/user.service";
import {
  Route,
  Post,
  Body,
  Middlewares,
  SuccessResponse,
  Query,
  Get,
} from "tsoa";
import validateInput from "../middlewares/validateInput";
import { IUser } from "../models/user.model";
import { UserSignInSchema, UserSignUpSchema } from "../schema/user-schema";
import { StatusCode } from "../utils/statusCode";
import { ROUTE_PATHS } from "../routes/route-defs";
import { generateSignature } from "../utils/jwt";

interface SignUpRequestBody {
  email: string;
  password: string;
}
interface LoginRequestBody {
  email: string;
  password: string;
}
@Route("/auth")
export class AuthController {
  @SuccessResponse(StatusCode.Created, "Created")
  @Post(ROUTE_PATHS.AUTH.SIGN_UP)
  @Middlewares(validateInput(UserSignUpSchema))
  public async SignUp(@Body() requestBody: SignUpRequestBody): Promise<IUser> {
    try {
      const { email, password } = requestBody;

      // Save User
      const userService = new UserService();
      const newUser = await userService.SignUp({ email, password });

      // Send Email Verification
      await userService.SendVerifyEmailToken({ userId: newUser._id });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(ROUTE_PATHS.AUTH.VERIFY)
  public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
    try {
      const userService = new UserService();

      // Verify the email token
      const user = await userService.VerifyEmailToken({ token });

      // Generate JWT for the verified user
      const jwtToken = await generateSignature({
        userId: user._id,
      });

      return { token: jwtToken };
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(ROUTE_PATHS.AUTH.LOGIN)
  @Middlewares(validateInput(UserSignInSchema))
  public async LoginWithEmail(
    @Body() requestBody: LoginRequestBody
  ): Promise<{ token: string }> {
    try {
      const { email, password } = requestBody;

      const userService = new UserService();
      const jwtToken = await userService.Login({ email, password });

      return {
        token: jwtToken,
      };
    } catch (error) {
      throw error;
    }
  }
}

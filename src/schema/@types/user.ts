import { z } from "zod";
import { UserSignUpSchema, UserSignInSchema } from "../../schema/user-schema";

export type UserSignUpSchemaType = ReturnType<typeof UserSignUpSchema.parse>;
export type UserSignInSchemaType = ReturnType<typeof UserSignInSchema.parse>

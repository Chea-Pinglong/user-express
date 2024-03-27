import {z} from "zod"
import { UserSchema } from "../userSchema"

export type UserSchemaType = ReturnType<typeof UserSchema.parse>
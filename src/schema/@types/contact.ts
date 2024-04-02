import {z} from "zod"
import { ContactSchema } from "../contactSchema"

export type ContactSchemaType = ReturnType<typeof ContactSchema.parse>
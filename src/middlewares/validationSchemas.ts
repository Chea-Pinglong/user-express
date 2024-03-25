import * as z from "zod"

const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  email: z.string().email(),
  password: z.string().min(6)
})

const updateUserSchema = createUserSchema.partial()
/**
 * Schema for creating a new user.
 */

export {
  createUserSchema,
  updateUserSchema
}

import * as z from "zod"
import { UserRole } from "@prisma/client"
import { CompleteAccount, relatedAccountSchema, CompleteSession, relatedSessionSchema, CompleteTask, relatedTaskSchema, CompleteTaskDefault, relatedTaskDefaultSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  role: z.nativeEnum(UserRole),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  tasks: CompleteTask[]
  taskDefaults: CompleteTaskDefault[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  accounts: relatedAccountSchema.array(),
  sessions: relatedSessionSchema.array(),
  tasks: relatedTaskSchema.array(),
  taskDefaults: relatedTaskDefaultSchema.array(),
}))

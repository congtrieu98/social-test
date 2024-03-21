import * as z from "zod";
import {
  CompleteMedia,
  relatedMediaSchema,
  CompleteHistory,
  relatedHistorySchema,
  CompleteUser,
  relatedUserSchema,
} from "./index";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  creator: z.string(),
  createAt: z.date(),
  deadlines: z.date(),
  priority: z.string(),
  assignedId: z.string(),
  description: z.string().array(),
  checked: z.string().array(),
  tokenNoticafition: z.string().nullish(),
});

export const tasksInputDateSchema = z.object({
  from: z.date(),
  to: z.date(),
});

export interface CompleteTask extends z.infer<typeof taskSchema> {
  medias: CompleteMedia[];
  history: CompleteHistory[];
  user: CompleteUser;
}

/**
 * relatedTaskSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTaskSchema: z.ZodSchema<CompleteTask> = z.lazy(() =>
  taskSchema.extend({
    medias: relatedMediaSchema.array(),
    history: relatedHistorySchema.array(),
    user: relatedUserSchema,
  })
);

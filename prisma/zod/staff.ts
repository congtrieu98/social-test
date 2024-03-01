import * as z from "zod";

export const staffSchema = z.object({
  id: z.string(),
  email: z.string().email().min(5).max(40),
});

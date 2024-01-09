import { historySchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getHistories } from "@/lib/api/histories/queries";


// Schema for histories - used to validate API requests
export const insertHistorySchema = historySchema.omit({ id: true });

export const insertHistoryParams = historySchema.extend({
  createAt: z.coerce.date()
}).omit({ 
  id: true,
  userId: true
});

export const updateHistorySchema = historySchema;

export const updateHistoryParams = updateHistorySchema.extend({
  createAt: z.coerce.date()
}).omit({ 
  userId: true
});

export const historyIdSchema = updateHistorySchema.pick({ id: true });

// Types for histories - used to type API request params and within Components
export type History = z.infer<typeof updateHistorySchema>;
export type NewHistory = z.infer<typeof insertHistorySchema>;
export type NewHistoryParams = z.infer<typeof insertHistoryParams>;
export type UpdateHistoryParams = z.infer<typeof updateHistoryParams>;
export type HistoryId = z.infer<typeof historyIdSchema>["id"];
    
// this type infers the return from getHistories() - meaning it will include any joins
export type CompleteHistory = Awaited<ReturnType<typeof getHistories>>["histories"][number];


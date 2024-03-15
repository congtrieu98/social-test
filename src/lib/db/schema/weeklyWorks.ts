import { weeklyWorkSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getWeeklyWorks } from "@/lib/api/weeklyWorks/queries";


// Schema for weeklyWorks - used to validate API requests
export const insertWeeklyWorkSchema = weeklyWorkSchema.omit({ id: true });

export const insertWeeklyWorkParams = weeklyWorkSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateWeeklyWorkSchema = weeklyWorkSchema;

export const updateWeeklyWorkParams = updateWeeklyWorkSchema.extend({}).omit({ 
  userId: true
});

export const weeklyWorkIdSchema = updateWeeklyWorkSchema.pick({ id: true });

// Types for weeklyWorks - used to type API request params and within Components
export type WeeklyWork = z.infer<typeof updateWeeklyWorkSchema>;
export type NewWeeklyWork = z.infer<typeof insertWeeklyWorkSchema>;
export type NewWeeklyWorkParams = z.infer<typeof insertWeeklyWorkParams>;
export type UpdateWeeklyWorkParams = z.infer<typeof updateWeeklyWorkParams>;
export type WeeklyWorkId = z.infer<typeof weeklyWorkIdSchema>["id"];
    
// this type infers the return from getWeeklyWorks() - meaning it will include any joins
export type CompleteWeeklyWork = Awaited<ReturnType<typeof getWeeklyWorks>>["weeklyWorks"][number];


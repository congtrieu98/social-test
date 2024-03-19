import { weeklyWorkDefaultSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getWeeklyWorkDefaults } from "@/lib/api/weeklyWorkDefaults/queries";


// Schema for weeklyWorkDefaults - used to validate API requests
export const insertWeeklyWorkDefaultSchema = weeklyWorkDefaultSchema.omit({ id: true });

export const insertWeeklyWorkDefaultParams = weeklyWorkDefaultSchema.extend({
  createdAt: z.coerce.date()
}).omit({ 
  id: true
});

export const updateWeeklyWorkDefaultSchema = weeklyWorkDefaultSchema;

export const updateWeeklyWorkDefaultParams = updateWeeklyWorkDefaultSchema.extend({
  createdAt: z.coerce.date()
})

export const weeklyWorkDefaultIdSchema = updateWeeklyWorkDefaultSchema.pick({ id: true });

// Types for weeklyWorkDefaults - used to type API request params and within Components
export type WeeklyWorkDefault = z.infer<typeof updateWeeklyWorkDefaultSchema>;
export type NewWeeklyWorkDefault = z.infer<typeof insertWeeklyWorkDefaultSchema>;
export type NewWeeklyWorkDefaultParams = z.infer<typeof insertWeeklyWorkDefaultParams>;
export type UpdateWeeklyWorkDefaultParams = z.infer<typeof updateWeeklyWorkDefaultParams>;
export type WeeklyWorkDefaultId = z.infer<typeof weeklyWorkDefaultIdSchema>["id"];
    
// this type infers the return from getWeeklyWorkDefaults() - meaning it will include any joins
export type CompleteWeeklyWorkDefault = Awaited<ReturnType<typeof getWeeklyWorkDefaults>>["weeklyWorkDefaults"][number];


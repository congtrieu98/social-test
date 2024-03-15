import { toolSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getTools } from "@/lib/api/tools/queries";


// Schema for tools - used to validate API requests
export const insertToolSchema = toolSchema.omit({ id: true });

export const insertToolParams = toolSchema.extend({}).omit({ 
  id: true
});

export const updateToolSchema = toolSchema;

export const updateToolParams = updateToolSchema.extend({})

export const toolIdSchema = updateToolSchema.pick({ id: true });

// Types for tools - used to type API request params and within Components
export type Tool = z.infer<typeof updateToolSchema>;
export type NewTool = z.infer<typeof insertToolSchema>;
export type NewToolParams = z.infer<typeof insertToolParams>;
export type UpdateToolParams = z.infer<typeof updateToolParams>;
export type ToolId = z.infer<typeof toolIdSchema>["id"];
    
// this type infers the return from getTools() - meaning it will include any joins
export type CompleteTool = Awaited<ReturnType<typeof getTools>>["tools"][number];


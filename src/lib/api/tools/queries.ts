import { db } from "@/lib/db/index";
import { type ToolId, toolIdSchema } from "@/lib/db/schema/tools";

export const getTools = async () => {
  const t = await db.tool.findMany({});
  return { tools: t };
};

export const getToolById = async (id: ToolId) => {
  const { id: toolId } = toolIdSchema.parse({ id });
  const t = await db.tool.findFirst({
    where: { id: toolId}});
  return { tools: t };
};


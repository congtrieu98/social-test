import { db } from "@/lib/db/index";
import { 
  ToolId, 
  NewToolParams,
  UpdateToolParams, 
  updateToolSchema,
  insertToolSchema, 
  toolIdSchema 
} from "@/lib/db/schema/tools";

export const createTool = async (tool: NewToolParams) => {
  const newTool = insertToolSchema.parse(tool);
  try {
    const t = await db.tool.create({ data: newTool });
    return { tool: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTool = async (id: ToolId, tool: UpdateToolParams) => {
  const { id: toolId } = toolIdSchema.parse({ id });
  const newTool = updateToolSchema.parse(tool);
  try {
    const t = await db.tool.update({ where: { id: toolId }, data: newTool})
    return { tool: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTool = async (id: ToolId) => {
  const { id: toolId } = toolIdSchema.parse({ id });
  try {
    const t = await db.tool.delete({ where: { id: toolId }})
    return { tool: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};


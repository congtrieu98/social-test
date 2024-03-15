import { getToolById, getTools } from "@/lib/api/tools/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  toolIdSchema,
  insertToolParams,
  updateToolParams,
} from "@/lib/db/schema/tools";
import { createTool, deleteTool, updateTool } from "@/lib/api/tools/mutations";

export const toolsRouter = router({
  getTools: publicProcedure.query(async () => {
    return getTools();
  }),
  getToolById: publicProcedure.input(toolIdSchema).query(async ({ input }) => {
    return getToolById(input.id);
  }),
  createTool: publicProcedure
    .input(insertToolParams)
    .mutation(async ({ input }) => {
      return createTool(input);
    }),
  updateTool: publicProcedure
    .input(updateToolParams)
    .mutation(async ({ input }) => {
      return updateTool(input.id, input);
    }),
  deleteTool: publicProcedure
    .input(toolIdSchema)
    .mutation(async ({ input }) => {
      return deleteTool(input.id);
    }),
});

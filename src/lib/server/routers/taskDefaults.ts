import { getTaskDefaultById, getTaskDefaults } from "@/lib/api/taskDefaults/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  taskDefaultIdSchema,
  insertTaskDefaultParams,
  updateTaskDefaultParams,
} from "@/lib/db/schema/taskDefaults";
import { createTaskDefault, deleteTaskDefault, updateTaskDefault } from "@/lib/api/taskDefaults/mutations";

export const taskDefaultsRouter = router({
  getTaskDefaults: publicProcedure.query(async () => {
    return getTaskDefaults();
  }),
  getTaskDefaultById: publicProcedure.input(taskDefaultIdSchema).query(async ({ input }) => {
    return getTaskDefaultById(input.id);
  }),
  createTaskDefault: publicProcedure
    .input(insertTaskDefaultParams)
    .mutation(async ({ input }) => {
      return createTaskDefault(input);
    }),
  updateTaskDefault: publicProcedure
    .input(updateTaskDefaultParams)
    .mutation(async ({ input }) => {
      return updateTaskDefault(input.id, input);
    }),
  deleteTaskDefault: publicProcedure
    .input(taskDefaultIdSchema)
    .mutation(async ({ input }) => {
      return deleteTaskDefault(input.id);
    }),
});

import { getTaskUpdateById, getTaskUpdates } from "@/lib/api/taskUpdates/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  taskUpdateIdSchema,
  insertTaskUpdateParams,
  updateTaskUpdateParams,
} from "@/lib/db/schema/taskUpdates";
import { createTaskUpdate, deleteTaskUpdate, updateTaskUpdate } from "@/lib/api/taskUpdates/mutations";

export const taskUpdatesRouter = router({
  getTaskUpdates: publicProcedure.query(async () => {
    return getTaskUpdates();
  }),
  getTaskUpdateById: publicProcedure.input(taskUpdateIdSchema).query(async ({ input }) => {
    return getTaskUpdateById(input.id);
  }),
  createTaskUpdate: publicProcedure
    .input(insertTaskUpdateParams)
    .mutation(async ({ input }) => {
      return createTaskUpdate(input);
    }),
  updateTaskUpdate: publicProcedure
    .input(updateTaskUpdateParams)
    .mutation(async ({ input }) => {
      return updateTaskUpdate(input.id, input);
    }),
  deleteTaskUpdate: publicProcedure
    .input(taskUpdateIdSchema)
    .mutation(async ({ input }) => {
      return deleteTaskUpdate(input.id);
    }),
});

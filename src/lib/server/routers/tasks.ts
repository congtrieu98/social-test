import {
  getTaskById,
  getTaskByUserAssign,
  getTasks,
} from "@/lib/api/tasks/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  taskIdSchema,
  insertTaskParams,
  updateTaskParams,
  taskAssignedIdSchema,
  updateTaskParamsOnlyChecked,
  updateTaskParamsStatus,
  updateTaskParamsPriority,
  updateTaskParamsTitle,
  updateTaskParamsDeadline,
} from "@/lib/db/schema/tasks";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskByDeadline,
  updateTaskByPriority,
  updateTaskByStatus,
  updateTaskByTitle,
  updateTaskOnlyChecked,
} from "@/lib/api/tasks/mutations";

export const tasksRouter = router({
  getTasks: publicProcedure.query(async () => {
    return getTasks();
  }),
  getTaskById: publicProcedure.input(taskIdSchema).query(async ({ input }) => {
    return getTaskById(input.id);
  }),
  getTaskByUserAssign: publicProcedure
    .input(taskAssignedIdSchema)
    .query(async ({ input }) => {
      return getTaskByUserAssign(input.assignedId);
    }),
  createTask: publicProcedure
    .input(insertTaskParams)
    .mutation(async ({ input }) => {
      return createTask(input);
    }),
  updateTask: publicProcedure
    .input(updateTaskParams)
    .mutation(async ({ input }) => {
      return updateTask(input.id, input);
    }),
  updateTaskByStatus: publicProcedure
    .input(updateTaskParamsStatus)
    .mutation(async ({ input }) => {
      return updateTaskByStatus(input.id, input);
    }),
  updateTaskByPriority: publicProcedure
    .input(updateTaskParamsPriority)
    .mutation(async ({ input }) => {
      return updateTaskByPriority(input.id, input);
    }),
  updateTaskByTitle: publicProcedure
    .input(updateTaskParamsTitle)
    .mutation(async ({ input }) => {
      return updateTaskByTitle(input.id, input);
    }),
  updateTaskByDeadline: publicProcedure
    .input(updateTaskParamsDeadline)
    .mutation(async ({ input }) => {
      return updateTaskByDeadline(input.id, input);
    }),
  updateTaskOnlyChecked: publicProcedure
    .input(updateTaskParamsOnlyChecked)
    .mutation(async ({ input }) => {
      return updateTaskOnlyChecked(input.id, input);
    }),
  deleteTask: publicProcedure
    .input(taskIdSchema)
    .mutation(async ({ input }) => {
      return deleteTask(input.id);
    }),
});

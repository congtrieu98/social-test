import { getTodoListById, getTodoLists } from "@/lib/api/todoLists/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  todoListIdSchema,
  insertTodoListParams,
  updateTodoListParams,
} from "@/lib/db/schema/todoLists";
import { createTodoList, deleteTodoList, updateTodoList } from "@/lib/api/todoLists/mutations";

export const todoListsRouter = router({
  getTodoLists: publicProcedure.query(async () => {
    return getTodoLists();
  }),
  getTodoListById: publicProcedure.input(todoListIdSchema).query(async ({ input }) => {
    return getTodoListById(input.id);
  }),
  createTodoList: publicProcedure
    .input(insertTodoListParams)
    .mutation(async ({ input }) => {
      return createTodoList(input);
    }),
  updateTodoList: publicProcedure
    .input(updateTodoListParams)
    .mutation(async ({ input }) => {
      return updateTodoList(input.id, input);
    }),
  deleteTodoList: publicProcedure
    .input(todoListIdSchema)
    .mutation(async ({ input }) => {
      return deleteTodoList(input.id);
    }),
});

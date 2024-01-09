import { router } from "@/lib/server/trpc";
import { tasksRouter } from "./tasks";
import { reportsRouter } from "./reports";
import { usersRouter } from "./users";
import { mediasRouter } from "./medias";
import { todoListsRouter } from "./todoLists";
import { historiesRouter } from "./histories";

export const appRouter = router({
  tasks: tasksRouter,
  reports: reportsRouter,
  users: usersRouter,
  medias: mediasRouter,
  todoLists: todoListsRouter,
  histories: historiesRouter,
});

export type AppRouter = typeof appRouter;

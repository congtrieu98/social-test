import { router } from "@/lib/server/trpc";
import { tasksRouter } from "./tasks";
import { taskUpdatesRouter } from "./taskUpdates";
import { reportsRouter } from "./reports";
import { usersRouter } from "./users";

export const appRouter = router({
  tasks: tasksRouter,
  taskUpdates: taskUpdatesRouter,
  reports: reportsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

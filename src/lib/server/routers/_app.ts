import { router } from "@/lib/server/trpc";
import { tasksRouter } from "./tasks";
import { taskUpdatesRouter } from "./taskUpdates";
import { reportsRouter } from "./reports";
import { usersRouter } from "./users";
import { mediasRouter } from "./medias";

export const appRouter = router({
  tasks: tasksRouter,
  taskUpdates: taskUpdatesRouter,
  reports: reportsRouter,
  users: usersRouter,
  medias: mediasRouter,
});

export type AppRouter = typeof appRouter;

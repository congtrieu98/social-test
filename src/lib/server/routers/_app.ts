import { router } from "@/lib/server/trpc";
import { tasksRouter } from "./tasks";
import { reportsRouter } from "./reports";
import { usersRouter } from "./users";
import { mediasRouter } from "./medias";
import { historiesRouter } from "./histories";
import { taskDefaultsRouter } from "./taskDefaults";
import { staffsRouter } from "./staffs";

export const appRouter = router({
  tasks: tasksRouter,
  reports: reportsRouter,
  users: usersRouter,
  medias: mediasRouter,
  histories: historiesRouter,
  taskDefaults: taskDefaultsRouter,
  staffs: staffsRouter,
});

export type AppRouter = typeof appRouter;

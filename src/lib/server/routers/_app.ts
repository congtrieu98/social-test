import { router } from "@/lib/server/trpc";
import { tasksRouter } from "./tasks";
import { reportsRouter } from "./reports";
import { usersRouter } from "./users";
import { mediasRouter } from "./medias";
import { historiesRouter } from "./histories";
import { taskDefaultsRouter } from "./taskDefaults";
import { staffsRouter } from "./staffs";
import { weeklyWorksRouter } from "./weeklyWorks";
import { toolsRouter } from "./tools";
import { weeklyWorkDefaultsRouter } from "./weeklyWorkDefaults";

export const appRouter = router({
  tasks: tasksRouter,
  reports: reportsRouter,
  users: usersRouter,
  medias: mediasRouter,
  histories: historiesRouter,
  taskDefaults: taskDefaultsRouter,
  staffs: staffsRouter,
  weeklyWorks: weeklyWorksRouter,
  tools: toolsRouter,
  weeklyWorkDefaults: weeklyWorkDefaultsRouter,
});

export type AppRouter = typeof appRouter;

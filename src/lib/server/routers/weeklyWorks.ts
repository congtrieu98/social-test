import { getWeeklyWorkById, getWeeklyWorks } from "@/lib/api/weeklyWorks/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  weeklyWorkIdSchema,
  insertWeeklyWorkParams,
  updateWeeklyWorkParams,
} from "@/lib/db/schema/weeklyWorks";
import { createWeeklyWork, deleteWeeklyWork, updateWeeklyWork } from "@/lib/api/weeklyWorks/mutations";

export const weeklyWorksRouter = router({
  getWeeklyWorks: publicProcedure.query(async () => {
    return getWeeklyWorks();
  }),
  getWeeklyWorkById: publicProcedure.input(weeklyWorkIdSchema).query(async ({ input }) => {
    return getWeeklyWorkById(input.id);
  }),
  createWeeklyWork: publicProcedure
    .input(insertWeeklyWorkParams)
    .mutation(async ({ input }) => {
      return createWeeklyWork(input);
    }),
  updateWeeklyWork: publicProcedure
    .input(updateWeeklyWorkParams)
    .mutation(async ({ input }) => {
      return updateWeeklyWork(input.id, input);
    }),
  deleteWeeklyWork: publicProcedure
    .input(weeklyWorkIdSchema)
    .mutation(async ({ input }) => {
      return deleteWeeklyWork(input.id);
    }),
});

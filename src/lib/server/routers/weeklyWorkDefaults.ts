import { getWeeklyWorkDefaultById, getWeeklyWorkDefaults } from "@/lib/api/weeklyWorkDefaults/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  weeklyWorkDefaultIdSchema,
  insertWeeklyWorkDefaultParams,
  updateWeeklyWorkDefaultParams,
} from "@/lib/db/schema/weeklyWorkDefaults";
import { createWeeklyWorkDefault, deleteWeeklyWorkDefault, updateWeeklyWorkDefault } from "@/lib/api/weeklyWorkDefaults/mutations";

export const weeklyWorkDefaultsRouter = router({
  getWeeklyWorkDefaults: publicProcedure.query(async () => {
    return getWeeklyWorkDefaults();
  }),
  getWeeklyWorkDefaultById: publicProcedure.input(weeklyWorkDefaultIdSchema).query(async ({ input }) => {
    return getWeeklyWorkDefaultById(input.id);
  }),
  createWeeklyWorkDefault: publicProcedure
    .input(insertWeeklyWorkDefaultParams)
    .mutation(async ({ input }) => {
      return createWeeklyWorkDefault(input);
    }),
  updateWeeklyWorkDefault: publicProcedure
    .input(updateWeeklyWorkDefaultParams)
    .mutation(async ({ input }) => {
      return updateWeeklyWorkDefault(input.id, input);
    }),
  deleteWeeklyWorkDefault: publicProcedure
    .input(weeklyWorkDefaultIdSchema)
    .mutation(async ({ input }) => {
      return deleteWeeklyWorkDefault(input.id);
    }),
});

import { getStaffById, getStaffs } from "@/lib/api/staffs/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  staffIdSchema,
  insertStaffParams,
  updateStaffParams,
} from "@/lib/db/schema/staffs";
import { createStaff, deleteStaff, updateStaff } from "@/lib/api/staffs/mutations";

export const staffsRouter = router({
  getStaffs: publicProcedure.query(async () => {
    return getStaffs();
  }),
  getStaffById: publicProcedure.input(staffIdSchema).query(async ({ input }) => {
    return getStaffById(input.id);
  }),
  createStaff: publicProcedure
    .input(insertStaffParams)
    .mutation(async ({ input }) => {
      return createStaff(input);
    }),
  updateStaff: publicProcedure
    .input(updateStaffParams)
    .mutation(async ({ input }) => {
      return updateStaff(input.id, input);
    }),
  deleteStaff: publicProcedure
    .input(staffIdSchema)
    .mutation(async ({ input }) => {
      return deleteStaff(input.id);
    }),
});

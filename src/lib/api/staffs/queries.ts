import { db } from "@/lib/db/index";
import { type StaffId, staffIdSchema } from "@/lib/db/schema/staffs";

export const getStaffs = async () => {
  const s = await db.staff.findMany({});
  return { staffs: s };
};

export const getStaffById = async (id: StaffId) => {
  const { id: staffId } = staffIdSchema.parse({ id });
  const s = await db.staff.findFirst({
    where: { id: staffId}});
  return { staffs: s };
};


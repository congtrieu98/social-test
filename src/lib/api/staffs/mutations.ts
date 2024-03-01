import { db } from "@/lib/db/index";
import { 
  StaffId, 
  NewStaffParams,
  UpdateStaffParams, 
  updateStaffSchema,
  insertStaffSchema, 
  staffIdSchema 
} from "@/lib/db/schema/staffs";

export const createStaff = async (staff: NewStaffParams) => {
  const newStaff = insertStaffSchema.parse(staff);
  try {
    const s = await db.staff.create({ data: newStaff });
    return { staff: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateStaff = async (id: StaffId, staff: UpdateStaffParams) => {
  const { id: staffId } = staffIdSchema.parse({ id });
  const newStaff = updateStaffSchema.parse(staff);
  try {
    const s = await db.staff.update({ where: { id: staffId }, data: newStaff})
    return { staff: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteStaff = async (id: StaffId) => {
  const { id: staffId } = staffIdSchema.parse({ id });
  try {
    const s = await db.staff.delete({ where: { id: staffId }})
    return { staff: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};


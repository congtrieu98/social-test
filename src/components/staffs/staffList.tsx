"use client";

import { CompleteStaff } from "@/lib/db/schema/staffs";
import StaffTableComponent from "../general/table/staff-table";
import StaffModal from "./staffModal";

const StaffList = ({ staffs }: { staffs: CompleteStaff[] }) => {
  if (staffs?.length === 0) {
    return <EmptyState />;
  }

  return <StaffTableComponent />;
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Chưa có nhân viên</h3>
      <div className="mt-6">{<StaffModal emptyState={true} />}</div>
    </div>
  );
};

export default StaffList;

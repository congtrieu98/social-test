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
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new staff.
      </p>
      <div className="mt-6">{<StaffModal emptyState={true} />}</div>
    </div>
  );
};

export default StaffList;

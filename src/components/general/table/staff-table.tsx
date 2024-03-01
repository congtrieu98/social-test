import { trpc } from "@/lib/trpc/client";
import { columnsStaff } from "./columnsStaff";
import { DataTableStaff } from "./data-table-staff";

export default function StaffTableComponent() {
  const { data: s } = trpc.staffs.getStaffs.useQuery();

  return (
    <div className="">
      <DataTableStaff
        columns={columnsStaff}
        //@ts-ignore
        data={s?.staffs.length > 0 ? s?.staffs : []}
      />
    </div>
  );
}

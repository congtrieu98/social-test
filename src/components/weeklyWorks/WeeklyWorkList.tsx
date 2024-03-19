"use client";
import { CompleteWeeklyWork } from "@/lib/db/schema/weeklyWorks";
import { trpc } from "@/lib/trpc/client";
import WeeklyWorkModal from "./WeeklyWorkModal";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { DataTableWeeklyDefault } from "./table/data-table-wwd";
import { columnsWeeklyDefault } from "./table/columns-wwd";


export default function WeeklyWorkList({ weeklyWorks }: { weeklyWorks: CompleteWeeklyWork[] }) {
  const { data: w } = trpc.weeklyWorks.getWeeklyWorks.useQuery(undefined, {
    initialData: { weeklyWorks },
    refetchOnMount: false,
  });

  const { data: wd } = trpc.weeklyWorkDefaults.getWeeklyWorkDefaults.useQuery()

  if (w?.weeklyWorks?.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <DataTable
        //@ts-ignore
        data={w?.weeklyWorks.length > 0 ? w?.weeklyWorks : []}
        columns={columns}
      />

      <h1 className="text-2xl font-semibold my-5">Công việc đã thực hiện</h1>
      <DataTableWeeklyDefault
        //@ts-ignore
        data={wd?.weeklyWorkDefaults.length! > 0 ? wd?.weeklyWorkDefaults : []}
        columns={columnsWeeklyDefault}
      />
    </>

  );
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Chưa có công việc nào</h3>
      <p className="mt-1 text-sm text-gray-500">
        Hãy tạo mới một công việc theo tuần.
      </p>
      <div className="mt-6">
        <WeeklyWorkModal emptyState={true} />
      </div>
    </div>
  );
};


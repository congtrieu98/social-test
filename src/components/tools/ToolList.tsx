"use client";
import { CompleteTool } from "@/lib/db/schema/tools";
import { trpc } from "@/lib/trpc/client";
import ToolModal from "./ToolModal";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export default function ToolList({ tools }: { tools: CompleteTool[] }) {
  const { data: t } = trpc.tools.getTools.useQuery(undefined, {
    initialData: { tools },
    refetchOnMount: false,
  });
  const { data: w } = trpc.weeklyWorks.getWeeklyWorks.useQuery();
  const dataCustom = t.tools.map((item) => {
    return {
      id: item.id,
      name: item.name,
      status:
        item.status === "normal"
          ? "Bình thường"
          : item.status === "damaged"
            ? "Bị hư/hỏng"
            : item.status === "hight"
              ? "Còn >= 50%"
              : item.status === "low"
                ? "Còn < 50%"
                : "",
      weeklyWorkId: w?.weeklyWorks.find((wly) => wly.id === item.weeklyWorkId)
        ?.name,
      quantityRemaining: item.quantityRemaining,
    };
  });

  if (t.tools.length === 0) {
    return <EmptyState />;
  }

  return (
    <DataTable
      //@ts-ignore
      data={dataCustom.length > 0 ? dataCustom : []}
      columns={columns}
    />
  );
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Chưa có dụng cụ nào được tạo
      </h3>
      <div className="mt-6">
        <ToolModal emptyState={true} />
      </div>
    </div>
  );
};

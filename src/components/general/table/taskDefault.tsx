import { trpc } from "@/lib/trpc/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function TaskDefaultComponent() {
  const { data: td } =
    trpc.taskDefaults.getTaskDefaults.useQuery();
  const dataCustom = td?.taskDefaults.map(item => {
    return {
      user: item.user.name,
      content: item.content,
      date: item.date
    }
  })
  return (
    <div className="">
      <DataTable columns={columns}
        //@ts-ignore 
        data={dataCustom?.length > 0 ? dataCustom : []} />
    </div>
  );
}

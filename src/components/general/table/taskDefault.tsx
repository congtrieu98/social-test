import { trpc } from "@/lib/trpc/client";
import { columns } from "./columns";
import { DataTableTaskDefault } from "./data-table-taskdefalt";
import { formatDateSlash } from "@/utils/constant";
import moment from "moment";

export default function TaskDefaultComponent() {
  const { data: td } = trpc.taskDefaults.getTaskDefaults.useQuery();
  const dataCustom = td?.taskDefaults.map((item) => {
    return {
      id: item.id,
      user: item.user.name,
      content: item.content,
      date: moment(item.date, formatDateSlash).format(formatDateSlash),
    };
  });
  return (
    <div className="">
      <DataTableTaskDefault
        columns={columns}
        //@ts-ignore
        data={dataCustom?.length > 0 ? dataCustom : []}
      />
    </div>
  );
}

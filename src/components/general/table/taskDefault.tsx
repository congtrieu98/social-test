import { trpc } from "@/lib/trpc/client";
import { taskDefault, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<taskDefault[]> {
  // Fetch data from your API here.
  const { data: listTaskDefault } =
    trpc.taskDefaults.getTaskDefaults.useQuery();
  //@ts-ignore
  return listTaskDefault?.taskDefaults;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

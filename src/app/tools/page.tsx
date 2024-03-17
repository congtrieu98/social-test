import ToolList from "@/components/tools/ToolList";
import NewToolModal from "@/components/tools/ToolModal";
import { getTools } from "@/lib/api/tools/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Tools() {
  await checkAuth()
  const { tools } = await getTools();

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Dụng cụ</h1>
        <NewToolModal />
      </div>
      <ToolList tools={tools} />
    </main>
  );
}

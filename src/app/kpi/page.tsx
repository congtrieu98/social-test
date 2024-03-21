import KpiList from "@/components/kpis/KpiList";
import { getTasks } from "@/lib/api/tasks/queries";
import { getUsers } from "@/lib/api/users/queries";
import { checkAuth } from "@/lib/auth/utils";

const Kpis = async () => {
  await checkAuth();
  const { tasks } = await getTasks();
  const { users } = await getUsers();

  return (
    <main className="max-w-full mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        {tasks.length > 0 && (
          <h1 className="font-semibold text-[18px] my-2">
            Danh sách công việc chưa hoàn thành
          </h1>
        )}
      </div>
      <KpiList tasks={tasks} users={users} />
    </main>
  );
};

export default Kpis;

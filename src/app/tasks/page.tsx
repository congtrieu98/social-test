import TaskList from "@/components/tasks/TaskList";
import NewTaskModal from "@/components/tasks/TaskModal";
import { getTasks } from "@/lib/api/tasks/queries";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";

export default async function Tasks() {
  await checkAuth();
  const { session } = await getUserAuth();
  const { tasks } = await getTasks();

  return (
    <main className="max-w-full mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-[18px] my-2">Danh sách công việc</h1>
        {session?.user?.email === "trieunguyen2806@gmail.com" &&
          tasks.length > 0 && <NewTaskModal />}
      </div>
      <TaskList tasks={tasks} />
    </main>
  );
}

import WeeklyWorkList from "@/components/weeklyWorks/WeeklyWorkList";
import NewWeeklyWorkModal from "@/components/weeklyWorks/WeeklyWorkModal";
import { getWeeklyWorks } from "@/lib/api/weeklyWorks/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function WeeklyWorks() {
  await checkAuth();
  const { weeklyWorks } = await getWeeklyWorks();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Weekly Works</h1>
        <NewWeeklyWorkModal />
      </div>
      <WeeklyWorkList weeklyWorks={weeklyWorks} />
    </main>
  );
}

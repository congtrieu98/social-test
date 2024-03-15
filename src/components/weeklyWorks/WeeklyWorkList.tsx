"use client";
import { CompleteWeeklyWork } from "@/lib/db/schema/weeklyWorks";
import { trpc } from "@/lib/trpc/client";
import WeeklyWorkModal from "./WeeklyWorkModal";


export default function WeeklyWorkList({ weeklyWorks }: { weeklyWorks: CompleteWeeklyWork[] }) {
  const { data: w } = trpc.weeklyWorks.getWeeklyWorks.useQuery(undefined, {
    initialData: { weeklyWorks },
    refetchOnMount: false,
  });

  if (w.weeklyWorks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {w.weeklyWorks.map((weeklyWork) => (
        <WeeklyWork weeklyWork={weeklyWork} key={weeklyWork.id} />
      ))}
    </ul>
  );
}

const WeeklyWork = ({ weeklyWork }: { weeklyWork: CompleteWeeklyWork }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{weeklyWork.name}</div>
      </div>
      <WeeklyWorkModal weeklyWork={weeklyWork} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No weekly works</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new weekly work.
      </p>
      <div className="mt-6">
        <WeeklyWorkModal emptyState={true} />
      </div>
    </div>
  );
};


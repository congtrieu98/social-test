import KpiList from "@/components/kpis/KpiList";
import { getReports } from "@/lib/api/reports/queries";
import { checkAuth } from "@/lib/auth/utils";

const Kpis = async () => {
  await checkAuth();
  const { reports } = await getReports()

  return (
    <main className="max-w-full mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        {reports.length > 0 && (
          <h1 className="font-semibold text-[18px] my-2">
            Kpi
          </h1>
        )}
      </div>
      <KpiList reports={reports} />
    </main>

  );
};

export default Kpis;

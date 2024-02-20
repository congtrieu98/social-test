"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { AlarmClockOff, AudioLines, Loader, Timer, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import {
  ROLE,
  formatDate,
  formatDateFull,
  formatDateSlash,
  formatDatetime,
} from "@/utils/constant";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  const { data: r } = trpc.reports.getReports.useQuery();
  console.log("rrrr", r);
  const dataByUser = r?.reports.filter((rep) => {
    if (session) {
      return rep.assignedTo === session.user.name;
    }
  });
  return (
    <>
      <div>Kpi</div>
      {/* <div className="pb-3 border-b mb-8">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{"Ten cong viec"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="flex mr-2">
                <Users />
              </span>
              <div className="space-y-2 mb-4">
                <p className="text-base font-medium">
                  Ngày report: <br />
                  <span className="font-semibold">{"hien thij ngay"}</span>
                </p>
              </div>
              <span className="flex mr-2">
                <Loader />
              </span>
              <div className="space-y-2 mb-4">
                <div className="text-base font-medium">
                  <p className="mb-2">
                    SL cv hoàn thành: {r?.reports?.jobCompleted}
                  </p>
                </div>
              </div>
              <span className="flex mr-2">
                <AudioLines />
              </span>
              <div className="space-y-2 mb-4">
                <div className="text-base font-medium">
                  <p className="mb-2">
                    SL cv chưa hoàn thành: {r?.reports?.jobUnfinished}
                  </p>
                </div>
              </div>
              <span className="flex mr-2">
                <Timer />
              </span>
              <div className="space-y-2 mb-4">
                <div className="text-base font-medium">
                  <p className="mb-2">
                    Tỉ lệ cv hoàn thành(%): {r?.reports?.jobCompletedPrecent}
                  </p>
                </div>
              </div>
              <span className="flex mr-2">
                <AlarmClockOff />
              </span>
              <div className="space-y-2">
                <div className="text-base font-medium">
                  <p className="mb-2">
                    Tỉ lệ cv chưa hoàn thành(%):{" "}
                    {r?.reports?.jobUnfinishedPercent}
                  </p>
                </div>
              </div>
              <span className="flex mr-2">
                <AlarmClockOff />
              </span>
              <div className="space-y-2">
                <div className="text-base font-medium">
                  <p className="mb-2">KPI:</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      <Table>
        <TableCaption>A list of your recent kpi.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Người thực hiện</TableHead>
            <TableHead>SL cv hoàn thành</TableHead>
            <TableHead>SL cv chưa hoàn thành</TableHead>
            <TableHead>Tỉ lệ cv hoàn thành</TableHead>
            <TableHead>Tỉ lệ cv chưa hoàn thành</TableHead>
            <TableHead>Ngày report</TableHead>
            <TableHead>KPI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(session?.user?.role === ROLE.ADMIN ? r?.reports : dataByUser)?.map(
            (report) => (
              <TableRow key={report.id}>
                <TableCell>{report.assignedTo}</TableCell>
                <TableCell>{report.jobCompleted}</TableCell>
                <TableCell>{report.jobUnfinished}</TableCell>
                <TableCell>{report.jobCompletedPrecent}%</TableCell>
                <TableCell>{report.jobUnfinishedPercent}%</TableCell>
                <TableCell className="w-[100px]">
                  {moment(report.reportDate, formatDateSlash).format(
                    formatDateSlash
                  )}
                </TableCell>
                <TableCell>{report.kpi}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Home;

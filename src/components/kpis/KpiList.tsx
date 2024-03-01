"use client";

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
import { ROLE, formatDateSlash } from "@/utils/constant";
import { useSession } from "next-auth/react";
import { CompleteReport } from "@/lib/db/schema/reports";

const KpiList = ({ reports }: { reports: CompleteReport[] }) => {
  const { data: session } = useSession();
  // Nếu user login vào xem thì chỉ cho xem những Kpis của họ
  const dataByUser = reports.filter((rep) => {
    rep.assignedTo === session?.user.name;
  });
  return (
    <>
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
          {(session?.user?.role === ROLE.ADMIN ? reports : dataByUser)?.map(
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

export default KpiList;

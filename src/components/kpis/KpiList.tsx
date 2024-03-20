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
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  return (
    <>
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              // initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
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

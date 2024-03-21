"use client";
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import { ROLE, formatDate, formatDateSlash } from "@/utils/constant";
import { useSession } from "next-auth/react";
import { CompleteTask } from "@/lib/db/schema/tasks";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { CompleteUser } from "@/lib/db/schema/users";
import { trpc } from "@/lib/trpc/client";

const KpiList = ({
  tasks,
  users,
}: {
  tasks: CompleteTask[];
  users: CompleteUser[];
}) => {
  const { data: session } = useSession();
  const taskByStatus = tasks.filter(
    (item: CompleteTask) => item.status !== "completed"
  );
  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const { data: t } = trpc.tasks.getTaskByDate.useQuery(date);
  const taskByStatusFillter = t?.taskByDate;
  const taskByStatusCustom = (
    taskByStatusFillter?.length! > 0 ? taskByStatusFillter! : taskByStatus
  ).map((t: any) => {
    return {
      id: t.id,
      assigndedId: users.find((u) => u.id === t.assignedId)?.name,
      title: t.title,
      status:
        t.status === "new"
          ? "Mới tạo"
          : t.status === "inprogress"
          ? "Đang thực hiện"
          : t.status === "reject"
          ? "Chưa hoàn thành"
          : "",
      deadline: moment(t.deadlines).format(formatDateSlash),
    };
  });

  // Nếu user login vào xem thì chỉ cho xem những Kpis của họ
  const dataByUser = taskByStatus.filter(
    (rep) => rep.assignedId === session?.user.id
  );

  const dataByUserCustom = dataByUser.map((t) => {
    return {
      id: t.id,
      assigndedId: users.find((u) => u.id === t.assignedId)?.name,
      title: t.title,
      status:
        t.status === "new"
          ? "Mới tạo"
          : t.status === "inprogress"
          ? "Đang thực hiện"
          : t.status === "reject"
          ? "Chưa hoàn thành"
          : "",
      deadline: moment(t.deadlines).format(formatDateSlash),
    };
  });

  // console.log(moment(date?.from).format(formatDateSlash));
  return (
    <>
      <div className={cn("flex space-x-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {moment(date.from).format(formatDate)} -{" "}
                    {moment(date.to).format(formatDate)}
                  </>
                ) : (
                  moment(date.from).format(formatDate)
                )
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              //@ts-ignore
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <DataTable
        //@ts-ignore
        data={
          taskByStatus?.length > 0 && session?.user.role === ROLE.ADMIN
            ? taskByStatusCustom
            : taskByStatus?.length > 0 && session?.user.role !== ROLE.ADMIN
            ? dataByUserCustom
            : []
        }
        columns={columns}
      />
    </>
  );
};

export default KpiList;

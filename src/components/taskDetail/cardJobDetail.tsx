"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import moment from "moment";
import { formatDateFull, formatDatetime } from "@/utils/constant";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { AlarmClockOff, AudioLines, Loader, Timer, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";
import { CompleteTask } from "@/lib/db/schema/tasks";

const CardJobDetail = ({
  t,
  taskId,
}: {
  t: CompleteTask;
  taskId: string;
  updatePriority: boolean;
}) => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: h } = trpc.histories.getHistories.useQuery();

  const { mutate: createHistories } =
    trpc.histories.createHistory.useMutation();
  const { mutate: updateHistories } =
    trpc.histories.updateHistory.useMutation();

  const { mutate: updateTaskByStatus, isLoading: updateStatus } =
    trpc.tasks.updateTaskByStatus.useMutation({
      onSuccess: async () => {
        await utils.tasks.getTaskById.invalidate();
        router.refresh();
        toast({
          title: "Success",
          description: `Update status succesfully!`,
          variant: "default",
        });
      },
    });

  const { mutate: updateTaskByPriority, isLoading: updatePriority } =
    trpc.tasks.updateTaskByPriority.useMutation({
      onSuccess: async () => {
        await utils.tasks.getTaskById.invalidate();
        router.refresh();
        toast({
          title: "Success",
          description: `Update priority succesfully!`,
          variant: "default",
        });
      },
    });

  const handlerChangeStatus = (val: string) => {
    try {
      if (t?.status !== val) {
        const findStatus = h?.histories.find(
          (item) => item.action === t?.status
        );
        if (findStatus) {
          updateHistories({
            id: findStatus?.id,
            taskId: taskId,
            action: val === "readed" ? "readedTask" : val,
            createAt: new Date(),
            content: `đã thay đổi status thành ${val}`,
            userId: session?.user?.name as string,
          });
        } else {
          createHistories({
            taskId: taskId,
            createAt: new Date(),
            action: val === "readed" ? "readedTask" : val,
            content: `đã thay đổi status thành ${val}`,
            userId: session?.user?.name as string,
          });
        }
        updateTaskByStatus({
          id: taskId,
          status: val,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error,
        variant: "default",
      });
    }
  };

  const handlerChangePriority = (val: string) => {
    try {
      if (t?.priority !== val) {
        const findPriority = h?.histories.find(
          (item) => item.action === t?.priority
        );
        if (findPriority) {
          updateHistories({
            id: findPriority?.id,
            taskId: taskId,
            action: val,
            createAt: new Date(),
            content: `đã thay đổi priority thành ${val}`,
            userId: session?.user?.name as string,
          });
        } else {
          createHistories({
            taskId: taskId,
            createAt: new Date(),
            action: val,
            content: `đã thay đổi priority thành ${val}`,
            userId: session?.user?.name as string,
          });
        }
        updateTaskByPriority({
          id: taskId,
          priority: val,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error,
        variant: "default",
      });
    }
  };

  return (
    <>
      <div className="pb-3 border-b mb-8">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t?.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex mr-2">
                  <Users />
                </span>
                <div className="space-y-2 mb-4">
                  <p className="text-base font-medium">
                    Người thực hiện: <br />
                    <span className="font-semibold">{t?.user?.name}</span>
                  </p>
                </div>
                <span className="flex mr-2">
                  <Loader />
                </span>
                <div className="space-y-2 mb-4">
                  <div className="text-base font-medium">
                    <div className="mb-2">
                      Trạng thái:{" "}
                      <Badge
                        variant="default"
                        className={
                          t?.status === "new"
                            ? "bg-gray-300"
                            : t?.status === "readed"
                            ? "bg-blue-300"
                            : t?.status === "inprogress"
                            ? "bg-yellow-300"
                            : t?.status === "reject"
                            ? "bg-red-400"
                            : "bg-green-500"
                        }
                      >
                        {t?.status}
                      </Badge>
                    </div>
                    {updateStatus ? (
                      <svg
                        className="animate-spin ml-7 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="black"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="black"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Select onValueChange={(val) => handlerChangeStatus(val)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              t?.status === "new"
                                ? "Mới tạo"
                                : t?.status === "readed"
                                ? "Đã xem"
                                : t?.status === "inprogress"
                                ? "Đang thực hiện"
                                : t?.status === "reject"
                                ? "Chưa hoàn thành"
                                : t?.status === "completed"
                                ? "Đã hoàn thành"
                                : ""
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="readed">Đã xem</SelectItem>
                            <SelectItem value="inprogress">
                              Đang thực hiện
                            </SelectItem>
                            <SelectItem value="reject">
                              Chưa hoàn thành
                            </SelectItem>
                            <SelectItem value="completed">
                              Đã hoàn thành
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <span className="flex mr-2">
                  <AudioLines />
                </span>
                <div className="space-y-2 mb-4">
                  <div className="text-base font-medium">
                    <div className="mb-2">
                      Mức độ ưu tiên:
                      <Badge
                        variant={
                          t?.priority === "urgent"
                            ? "destructive"
                            : t?.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className={`ml-2 ${
                          t?.priority === "hight"
                            ? "bg-green-700 text-white"
                            : ""
                        }`}
                      >
                        {t?.priority}
                      </Badge>
                    </div>
                    {updatePriority ? (
                      <svg
                        className="animate-spin ml-7 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="black"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="black"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Select
                        onValueChange={(val) => handlerChangePriority(val)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              t?.priority === "urgent"
                                ? "Cấp thiết"
                                : t?.priority === "hight"
                                ? "Cao"
                                : t?.priority === "medium"
                                ? "Bình thường"
                                : t?.priority === "low"
                                ? "Thấp"
                                : ""
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="urgent">Cấp thiết</SelectItem>
                            <SelectItem value="hight">Cao</SelectItem>
                            <SelectItem value="medium">Bình thường</SelectItem>
                            <SelectItem value="low">Thấp</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <span className="flex mr-2">
                  <Timer />
                </span>
                <div className="space-y-2 mb-4">
                  <p className="text-base font-medium ">Thời gian bắt đầu</p>
                  <p className="text-sm font-medium ">
                    {t?.createAt
                      ? moment(t?.createAt, formatDateFull).format(
                          formatDatetime
                        )
                      : ""}
                  </p>
                </div>
                <span className="flex mr-2">
                  <AlarmClockOff />
                </span>
                <div className="space-y-2">
                  <p className="text-base font-medium ">Thời gian kết thúc</p>
                  <p className="text-sm font-medium ">
                    {t?.deadlines
                      ? moment(t?.deadlines, formatDateFull).format(
                          formatDatetime
                        )
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CardJobDetail;

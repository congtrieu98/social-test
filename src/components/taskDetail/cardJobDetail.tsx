'use client'

import { CompleteTask } from "@/lib/db/schema/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import moment from "moment";
import { formatDateFull, formatDatetime } from "@/utils/constant";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

const CardJobDetail = ({ t, taskId }: { t: any, taskId: string }) => {
    console.log("taskId:", taskId)
    const router = useRouter()
    const { mutate: updateTaskByStatus, isLoading: updateStatus } =
        trpc.tasks.updateTaskByStatus.useMutation({
            onSuccess: () => {
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
            onSuccess: () => {
                router.refresh();
                toast({
                    title: "Success",
                    description: `Update priority succesfully!`,
                    variant: "default",
                });
            },
        });

    const handlerChangeStatus = (val: string) => {
        updateTaskByStatus({
            id: taskId,
            status: val,
        });
    };

    const handlerChangePriority = (val: string) => {
        updateTaskByPriority({
            id: taskId,
            priority: val,
        });
        // mutationHistories.mutate({
        //   taskId: taskId as string,
        //   createAt: new Date(),
        //   content: `đã thay đổi status thành ${val}`,
        //   userId: session?.user?.id as string,
        // });
    };
    return (
        <>
            <div className="pb-3 border-b mb-8">
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>{t?.tasks?.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div>
                            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                <span className="flex mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-users"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </span>
                                <div className="space-y-2 mb-4">
                                    <p className="text-base font-medium">
                                        Người thực hiện: <br />
                                        <span className="font-semibold">
                                            {t?.tasks?.user?.name}
                                        </span>
                                    </p>
                                </div>
                                <span className="flex mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-loader"
                                    >
                                        <line x1="12" x2="12" y1="2" y2="6" />
                                        <line x1="12" x2="12" y1="18" y2="22" />
                                        <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
                                        <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
                                        <line x1="2" x2="6" y1="12" y2="12" />
                                        <line x1="18" x2="22" y1="12" y2="12" />
                                        <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
                                        <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
                                    </svg>
                                </span>
                                <div className="space-y-2 mb-4">
                                    <p className="text-base font-medium">
                                        Trạng thái:{" "}
                                        <Select
                                            onValueChange={(val) => handlerChangeStatus(val)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue
                                                    placeholder={
                                                        updateStatus ? (
                                                            <svg
                                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                                                        ) :
                                                            t?.tasks?.status === "readed" ? (
                                                                "Đã xem"
                                                            ) : t?.tasks?.status === "inprogress" ? (
                                                                "Đang thực hiện"
                                                            ) : t?.tasks?.status === "reject" ? (
                                                                "CHưa hoàn thành"
                                                            ) : (
                                                                "Đã hoàn thành"
                                                            )
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
                                    </p>
                                </div>
                                <span className="flex mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-audio-lines"
                                    >
                                        <path d="M2 10v3" />
                                        <path d="M6 6v11" />
                                        <path d="M10 3v18" />
                                        <path d="M14 8v7" />
                                        <path d="M18 5v13" />
                                        <path d="M22 10v3" />
                                    </svg>
                                </span>
                                <div className="space-y-2 mb-4">
                                    <p className="text-base font-medium">
                                        Mức độ ưu tiên:{" "}
                                        <Select
                                            onValueChange={(val) => handlerChangePriority(val)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue
                                                    placeholder={
                                                        t?.tasks?.priority === "hight"
                                                            ? "Cao"
                                                            : t?.tasks?.priority === "medium"
                                                                ? "Bình thường"
                                                                : "Thấp"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="hight">Cao</SelectItem>
                                                    <SelectItem value="medium">
                                                        Bình thường
                                                    </SelectItem>
                                                    <SelectItem value="low">Thấp</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </p>
                                </div>
                                <span className="flex mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-timer"
                                    >
                                        <line x1="10" x2="14" y1="2" y2="2" />
                                        <line x1="12" x2="15" y1="14" y2="11" />
                                        <circle cx="12" cy="14" r="8" />
                                    </svg>
                                </span>
                                <div className="space-y-2 mb-4">
                                    <p className="text-base font-medium ">
                                        Thời gian bắt đầu
                                    </p>
                                    <p className="text-sm font-medium ">
                                        {moment(t?.tasks?.createAt, formatDateFull).format(
                                            formatDatetime
                                        )}
                                    </p>
                                </div>
                                <span className="flex mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-timer-off"
                                    >
                                        <path d="M10 2h4" />
                                        <path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" />
                                        <path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" />
                                        <path d="m2 2 20 20" />
                                        <path d="M12 12v-2" />
                                    </svg>
                                </span>
                                <div className="space-y-2">
                                    <p className="text-base font-medium ">
                                        Thời gian kết thúc
                                    </p>
                                    <p className="text-sm font-medium ">
                                        {moment(t?.tasks?.deadlines, formatDateFull).format(
                                            formatDatetime
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default CardJobDetail;
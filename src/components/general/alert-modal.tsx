"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CompleteTask } from "@/lib/db/schema/tasks";
import { trpc } from "@/lib/trpc/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

interface desCustom {
  id: string;
  content: string;
}
export function AlertModal({
  task,
  item,
}: {
  task: CompleteTask;
  item: desCustom;
}) {
  const ultis = trpc.useContext();
  const router = useRouter();
  const onSuccess = async () => {
    await ultis.tasks.getTaskById.invalidate();
    router.refresh();
    toast({
      title: "Success",
      description: "Delete content successfully!",
    });
  };
  const { mutate: updateTask, isLoading: isUpdating } =
    trpc.tasks.updateTask.useMutation({
      onSuccess: () => onSuccess(),
    });
  const handleDeleteDes = (val: string) => {
    const arrayUpdate = task?.description.filter(
      (des, index) => index.toString() !== val
    );

    if ((arrayUpdate?.length as number) > 0) {
      (task.description as string[]) = arrayUpdate;
      updateTask({ ...task });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isUpdating && item?.id ? (
          <svg
            className="animate-spin h-5 w-5 text-black"
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
          <div className="cursor-pointer">
            <Trash2 size={16} />
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm">
            Are you sure you want to delete this content?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-xs"
            onClick={() => handleDeleteDes(item.id)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

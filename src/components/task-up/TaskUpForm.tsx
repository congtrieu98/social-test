"use client";


import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { TaskUpdate } from "@/lib/db/schema/taskUpdates";


const TaskUpForm = ({
  taskUp,
  closeModal,
}: {
  taskUp?: TaskUpdate;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!taskUp?.id;

  const router = useRouter();
  const utils = trpc.useContext();
  
  // console.log(users)
  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.tasks.getTasks.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Task ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createTask, isLoading: isCreating } =
    trpc.tasks.createTask.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateTask, isLoading: isUpdating } =
    trpc.tasks.updateTask.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteTask, isLoading: isDeleting } =
    trpc.taskUpdates.deleteTaskUpdate.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

 
  return (
    <>
    <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteTask({ id: taskUp.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
    </>
  );
};

export default TaskUpForm;

"use client";

import {
  NewTaskParams,
  insertTaskParams,
  CompleteTask,
} from "@/lib/db/schema/tasks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import InputForm from "../general/form/inputForm";
import moment from "moment";
import {
  CompleteStaff,
  NewStaffParams,
  insertStaffParams,
} from "@/lib/db/schema/staffs";

const StaffForm = ({
  staff,
  closeModal,
}: {
  staff?: CompleteStaff;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!staff?.id;

  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof insertStaffParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertStaffParams),
    defaultValues: staff ?? {
      email: undefined,
    },
  });
  const onSuccess = async (action: "Thêm" | "Cập nhật" | "Xóa") => {
    await utils.staffs.getStaffs.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `${action} user thành công!`,
      variant: "default",
    });
  };

  const { mutate: createStaff, isLoading: isCreating } =
    trpc.staffs.createStaff.useMutation({
      onSuccess: async () => {
        onSuccess("Thêm");
      },
    });

  const { mutate: updateStaff, isLoading: isUpdating } =
    trpc.staffs.updateStaff.useMutation({
      onSuccess: async () => {
        onSuccess("Cập nhật");
      },
    });

  const { mutate: deleteStaff, isLoading: isDeleting } =
    trpc.staffs.deleteStaff.useMutation({
      onSuccess: () => onSuccess("Xóa"),
    });

  const handleSubmit = (values: NewStaffParams) => {
    console.log("values:", values);
    if (editing) {
      updateStaff({ ...values, id: staff.id });
    } else {
      createStaff(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <InputForm
          //@ts-ignore
          form={form}
          title={"Email"}
          name="email"
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing && (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteStaff({ id: staff?.id as string })}
            disabled={isUpdating}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default StaffForm;

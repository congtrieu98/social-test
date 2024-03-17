"use client";

import { WeeklyWork, NewWeeklyWorkParams, insertWeeklyWorkParams } from "@/lib/db/schema/weeklyWorks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const WeeklyWorkForm = ({
  weeklyWork,
  closeModal,
}: {
  weeklyWork?: WeeklyWork;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!weeklyWork?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertWeeklyWorkParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertWeeklyWorkParams),
    defaultValues: weeklyWork ?? {
      name: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.weeklyWorks.getWeeklyWorks.invalidate();
    router.refresh();
    closeModal(); toast({
      title: 'Success',
      description: `Weekly Work ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createWeeklyWork, isLoading: isCreating } =
    trpc.weeklyWorks.createWeeklyWork.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateWeeklyWork, isLoading: isUpdating } =
    trpc.weeklyWorks.updateWeeklyWork.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteWeeklyWork, isLoading: isDeleting } =
    trpc.weeklyWorks.deleteWeeklyWork.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewWeeklyWorkParams) => {
    if (editing) {
      updateWeeklyWork({ ...values, id: weeklyWork.id });
    } else {
      createWeeklyWork(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
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
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteWeeklyWork({ id: weeklyWork.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default WeeklyWorkForm;

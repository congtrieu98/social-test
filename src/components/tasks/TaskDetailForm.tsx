"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  NewTodoListParams,
  insertTodoListParams,
} from "@/lib/db/schema/todoLists";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export function TaskDetailForm({
  userSelected,
  closeModal,
}: {
  userSelected: string;
  closeModal: () => void;
}) {
  const router = useRouter();
  const utils = trpc.useContext();
  const form = useForm<z.infer<typeof insertTodoListParams>>({
    resolver: zodResolver(insertTodoListParams),
    defaultValues: {
      content: "",
      userId: userSelected ? userSelected : "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.todoLists.getTodoLists.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `TodoList ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createTodoList, isLoading: isCreating } =
    trpc.todoLists.createTodoList.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const onSubmit = (values: NewTodoListParams) => {
    console.log("task Detail", values);
    // createTodoList(values);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nhập nội dung..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}

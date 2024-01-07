/* eslint-disable @next/next/no-async-client-component */
"use client";

import { trpc } from "@/lib/trpc/client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { NewTaskParams, insertTaskParams, updateTaskParams } from "@/lib/db/schema/tasks";

export default function TaskDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });
  const { data: t } = trpc.tasks.getTaskById.useQuery({ id: params?.id });
  // const { data: todoLists } = trpc.todoLists.getTodoLists.useQuery();
  const { mutate: updateTask } = trpc.tasks.updateTask.useMutation();
  useEffect(() => {
    if (params?.id && session?.user?.role !== "ADMIN") {
      if (t?.tasks) {
        return updateTask({
          id: params?.id,
          status: "readed",
          title: t.tasks.title,
          description: t.tasks.description,
          creator: t.tasks.creator,
          createAt: t.tasks.createAt,
          deadlines: t.tasks.deadlines,
          priority: t.tasks.priority,
          assignedId: t.tasks.assignedId,
          checked: t.tasks.checked
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, t]);

  interface desCustom {
    id: string;
    content: string
  }
  const listDescript = t?.tasks?.description.map<desCustom>((item) => (
    {
      id: item,
      content: item
    }
  ))
  const FormSchema = z.object({
    checked: z.array(z.string()),
  })

  const arrayJob = []
  t?.tasks?.checked.map(item => arrayJob.push(item))
  console.log(arrayJob?.length)
  console.log(arrayJob)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checked: ['cong viecj cần làm 1', 'công việc cần làm 2'] || [] as string[]
    },
  })
  console.log(typeof (arrayJob))
  const onSubmit = (values: NewTaskParams) => {
    console.log(values)
    updateTask({
      id: params?.id,
      status: t?.tasks?.status as string,
      title: t?.tasks?.title as string,
      description: t?.tasks?.description as string[],
      creator: t?.tasks?.creator as string,
      createAt: t?.tasks?.createAt as Date,
      deadlines: t?.tasks?.deadlines as Date,
      priority: t?.tasks?.priority as string,
      assignedId: t?.tasks?.assignedId as string,
      checked: values?.checked
    });
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })

  }
  return (
    <>
      {session ? (
        <div className="items-center">
          <div className="text-xl font-semibold mb-4">Chi tiết công việc</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="checked"
                render={() => (
                  <FormItem>
                    {listDescript?.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="checked"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.content}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      ) : null}
    </>
  );
}

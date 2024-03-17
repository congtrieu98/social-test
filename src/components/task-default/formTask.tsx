"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import TaskDefaultComponent from "../general/table/taskDefault";
import NewWeeklyWorkModal from "@/components/weeklyWorks/WeeklyWorkModal";
import { CompleteWeeklyWork } from "@/lib/db/schema/weeklyWorks";
import WeeklyWorkList from "../weeklyWorks/WeeklyWorkList";

const items = [
  {
    id: "Dọn vệ sinh",
    label: "Dọn vệ sinh",
  },
  {
    id: "Cúng kiếng",
    label: "Cúng kiếng",
  },
  {
    id: "Tưới cây",
    label: "Tưới cây",
  },
  {
    id: "Cho cá ăn",
    label: "Cho cá ăn",
  },
  {
    id: "Cho gà ăn",
    label: "Cho gà ăn",
  },
] as const;


const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Vui lòng tick chọn công việc!",
  }),
});

export default function TaskDefault() {
  const utils = trpc.useContext();

  const { data: w } = trpc.weeklyWorks.getWeeklyWorks.useQuery();

  const { mutate: createTaskDefault, isLoading: isCreateTaskDefault } =
    trpc.taskDefaults.createTaskDefault.useMutation({
      onSuccess: () => onSuccess(),
    });

  // const { data: }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSuccess = async () => {
    await utils.taskDefaults.getTaskDefaults.invalidate();
    toast({
      title: "Success",
      description: "Submit thành công!",
    });
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createTaskDefault({
      jobDetails: data.items,
      content: `Đã tick chọn: ${data.items.toString()}`,
      date: new Date(),
    });
  }

  return (
    <>

      <Tabs defaultValue="tasksDaily">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasksDaily">Tasks Daily</TabsTrigger>
          <TabsTrigger value="tasksWeekly">Tasks Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value="tasksDaily">
          <div className="pb-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-lg font-bold">
                          Việc cố định hàng ngày
                        </FormLabel>
                        <FormDescription>
                          Được thực hiện từ 6:00 - 9:00.
                        </FormDescription>
                      </div>
                      {items.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="items"
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
                                        );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isCreateTaskDefault}>
                  {isCreateTaskDefault ? "Submiting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="rounded-md">
            <TaskDefaultComponent />
          </div>
        </TabsContent>

        <TabsContent value="tasksWeekly">
          <div className="flex justify-between">
            <h1 className="font-semibold text-2xl my-2">Công việc theo tuần</h1>
            <NewWeeklyWorkModal />
          </div>
          <div className="w-full py-5">
            <Button>New task</Button>
          </div>
          <WeeklyWorkList weeklyWorks={w?.weeklyWorks as CompleteWeeklyWork[]} />
        </TabsContent>
      </Tabs>
    </>
  );
}

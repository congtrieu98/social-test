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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { formatDateSlash } from "@/utils/constant";
import DemoPage from "../general/table/taskDefault";
const items = [
  {
    id: "Tưới cây",
    label: "Tưới cây",
  },
  {
    id: "Cho cá ăn",
    label: "Cho cá ăn",
  },
  {
    id: "Lau nhà",
    label: "Lau nhà",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Vui lòng tick chọn công việc!",
  }),
});

export default function TaskDefault() {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const router = useRouter();

  const { mutate: createTaskDefault, isLoading: isCreateTaskDefault } =
    trpc.taskDefaults.createTaskDefault.useMutation({
      onSuccess: () => onSuccess(),
    });

  const { data: listTaskDefault } =
    trpc.taskDefaults.getTaskDefaults.useQuery();
  console.log("listTaskDefault:", listTaskDefault);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSuccess = async () => {
    await utils.taskDefaults.getTaskDefaults.invalidate();
    router.refresh();
    toast({
      title: "Success",
      description: "Submit thành công!",
    });
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data jobDetail:", data);
    console.log(data.items.toString());
    createTaskDefault({
      jobDetails: data.items,
      content: `Đã tick chọn: ${data.items.toString()}`,
      date: new Date(),
    });
  }

  return (
    <>
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
                      Được thực hiện từ 5:00 - 7:00.
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
            <Button type="submit">
              {isCreateTaskDefault ? "Submiting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="rounded-md border">
        <DemoPage />
        {/* <Table className="pt-10">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Người thực hiện</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listTaskDefault?.taskDefaults.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.user.name}</TableCell>
                <TableCell>{item.content}</TableCell>
                <TableCell>
                  {moment(item.date, formatDateSlash).format(formatDateSlash)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
      </div>
    </>
  );
}

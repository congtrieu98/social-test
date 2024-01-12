/* eslint-disable @next/next/no-async-client-component */
"use client";

import { trpc } from "@/lib/trpc/client";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import CardJobDetail from "@/components/taskDetail/cardJobDetail";
import UploadImage from "@/components/taskDetail/uploadImage";
import moment from "moment";
import { formatDateFull, formatTimeDate } from "@/utils/constant";
import Link from "next/link";

interface FileWithPreview extends File {
  preview?: string;
  loading?: boolean;
  path?: string;
}

export default function TaskDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });
  const [files, setFiles] = useState<File[]>([]);

  const onSuccess = async () => {
    await utils.tasks.getTasks.invalidate();
    router.refresh();
    toast({
      title: "Gửi xác nhận thành công!",
      variant: "default",
    });
  };
  const { data: t } = trpc.tasks.getTaskById.useQuery({ id: params?.id });
  const { data: h } = trpc.histories.getHistories.useQuery();

  const { mutate: updateTaskByStatus } =
    trpc.tasks.updateTaskByStatus.useMutation();

  const { mutate: createHistories } =
    trpc.histories.createHistory.useMutation();
  const { mutate: updateHistories } =
    trpc.histories.updateHistory.useMutation();

  const mutation = trpc.medias.createMedia.useMutation();
  const { mutate: updateTaskOnlyChecked, isLoading: isUpdateOnlyChecked } =
    trpc.tasks.updateTaskOnlyChecked.useMutation({
      onSuccess: async ({ task }) => {
        if (files.length > 0 && task) {
          files.forEach((file: FileWithPreview) => {
            if (file.preview) {
              const taskId = task.id;
              mutation.mutate({ taskId: taskId, url: file.preview });
            }
          });
        }
        onSuccess();
      },
    });

  // useEffect(() => {
  if (params?.id && session?.user?.role !== "ADMIN") {
    if (t?.tasks) {
      const findHisByAction = h?.histories.find(
        (his) => his.action === "readedTask"
      );
      if (!findHisByAction) {
        createHistories({
          taskId: params?.id as string,
          createAt: new Date(),
          action: "readedTask",
          content: "đã xem task",
          userId: session?.user?.name as string,
        });
        updateTaskByStatus({
          id: params?.id,
          status: "readed",
        });
      }
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params?.id, t]);

  interface desCustom {
    id: string;
    content: string;
  }

  const listDescript = t?.tasks?.description.map<desCustom>((item) => ({
    id: item,
    content: item,
  }));
  const FormSchema = z.object({
    checked: z.array(z.string()),
  });

  const arrayJob = [] as string[];
  t?.tasks?.checked.map((item) => arrayJob.push(item));
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checked: arrayJob?.length > 0 ? arrayJob : ([] as string[]),
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    updateTaskOnlyChecked({
      id: params?.id,
      checked: values?.checked,
    });
    const arrayTicked = [] as string[];
    const arrayDeleteTicked = [] as string[];
    const lengthDatabase = t?.tasks?.checked?.length as number;
    const lengthCurent = values?.checked?.length;
    if (lengthDatabase < lengthCurent) {
      // user tick chọn
      values?.checked.map((item) => {
        if (t?.tasks?.checked.includes(item)) {
          return null;
        } else {
          arrayTicked.push(item);
        }
      });
    } else {
      // user bỏ chọn
      t?.tasks?.checked.map((item) => {
        if (values?.checked.includes(item)) {
          return null;
        } else {
          arrayDeleteTicked.push(item);
        }
      });
    }

    if (arrayTicked?.length > 0) {
      createHistories({
        taskId: params?.id as string,
        action: "ticked",
        createAt: new Date(),
        content: `đã tick chọn thực hiện công việc ${arrayTicked.toString()}`,
        userId: session?.user?.name as string,
      });
    }

    if (arrayDeleteTicked?.length > 0) {
      const findChecked = h?.histories.find((his) => his?.action === "ticked");
      if (findChecked) {
        updateHistories({
          id: findChecked?.id,
          taskId: params?.id as string,
          action: "deleteTicked",
          createAt: new Date(),
          content: `đã bỏ chọn thực hiện công việc ${arrayDeleteTicked.toString()}`,
          userId: session?.user?.name as string,
        });
      }
    }
  };

  return (
    <>
      {session ? (
        <div
          className="w-full first-letter:max-w-xl mx-auto
           items-center"
        >
          <div className="mb-5">
            <div className="text-2xl font-semibold mb-4">
              Chi tiết công việc
            </div>
            {/* @ts-ignore */}
            <CardJobDetail t={t?.tasks} taskId={params?.id} />
            <div className="text-xl font-semibold mb-4">
              Công việc thực hiện
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                                    checked={(field.value?.length > 0
                                      ? field.value
                                      : arrayJob
                                    )?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange(
                                            field.value?.length > 0
                                              ? [...field.value, item.id]
                                              : [...arrayJob, item.id]
                                          )
                                        : field.onChange(
                                            (field.value?.length > 0
                                              ? field.value
                                              : arrayJob
                                            )?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item.content}
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

                <UploadImage
                  // @ts-ignore
                  t={t?.tasks}
                  taskId={params?.id}
                  files={files}
                  setFiles={setFiles}
                />
                <Button type="submit">
                  Submit{isUpdateOnlyChecked ? "ing..." : ""}
                </Button>
              </form>
            </Form>
          </div>

          {session?.user?.role === "ADMIN" && (
            <div className="">
              <div className="text-xl font-semibold">Active</div>
              <ul>
                {h?.histories.map((his) => {
                  return (
                    <li>
                      <span className="font-semibold underline">
                        {his?.userId}
                      </span>{" "}
                      {his?.action === "deleteImage" ? (
                        <Link href="/medias">{his?.content}</Link>
                      ) : (
                        his?.content
                      )}{" "}
                      {`lúc ${moment(his?.createAt, formatDateFull).format(
                        formatTimeDate
                      )}`}
                      .
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

/* eslint-disable @next/next/no-async-client-component */
"use client";

import { trpc } from "@/lib/trpc/client";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useDropzone } from "react-dropzone";
import { uploadVercel } from "@/lib/utils";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateFull, formatDatetime } from "@/utils/constant";
import moment from "moment";

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
  const [loading, setLoading] = useState<Boolean>(false);

  const onSuccess = async () => {
    await utils.tasks.getTasks.invalidate();
    router.refresh();
    toast({
      title: "Gửi xác nhận thành công!",
      variant: "default",
    });
  };
  const { data: t } = trpc.tasks.getTaskById.useQuery({ id: params?.id });
  const { mutate: updateTask } = trpc.tasks.updateTask.useMutation();
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
  const mutationHistories = trpc.histories.createHistory.useMutation();

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

  const { mutate: deleteImage, isLoading: isImageDeleting } =
    trpc.medias.deleteMedia.useMutation({
      onSuccess: () => {
        isImageDeleting ? setLoading(true) : setLoading(false);
        mutationHistories.mutate({
          taskId: params?.id as string,
          createAt: new Date(),
          content: "đã xóa ảnh",
          userId: session?.user?.id as string,
        });
        router.refresh();
        toast({
          title: "Success",
          description: `Image deledated!`,
          variant: "default",
        });
      },
    });

  const onDrop = useCallback((acceptedFiles: Array<FileWithPreview>) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => ({
          ...file,
          loading: true,
          erorrs: [],
        })),
      ]);

      acceptedFiles.forEach((file, index) => {
        uploadVercel(file).then((url) => {
          setFiles((previousFiles) =>
            previousFiles.map((prevFile, prevIndex) => {
              if (
                prevIndex ===
                index + previousFiles.length - acceptedFiles.length
              ) {
                return { ...prevFile, preview: url, loading: false };
              } else {
                return prevFile;
              }
            })
          );
        });
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  const handlerChangeStatus = (val: string) => {
    updateTaskByStatus({
      id: params?.id,
      status: val,
    });
    // mutationHistories.mutate({
    //   taskId: params?.id as string,
    //   createAt: new Date(),
    //   content: `đã thay đổi status thành ${val}`,
    //   userId: session?.user?.id as string,
    // });
  };

  const handlerChangePriority = (val: string) => {
    updateTaskByPriority({
      id: params?.id,
      priority: val,
    });
    // mutationHistories.mutate({
    //   taskId: params?.id as string,
    //   createAt: new Date(),
    //   content: `đã thay đổi status thành ${val}`,
    //   userId: session?.user?.id as string,
    // });
  };

  useEffect(() => {
    return () =>
      files.forEach((file: FileWithPreview) =>
        URL.revokeObjectURL(file.preview as string)
      );
  }, [files]);

  const removeFile = (path: string) => {
    setFiles((files) =>
      files.filter((file: FileWithPreview) => file.path !== path)
    );
  };

  useEffect(() => {
    if (params?.id && session?.user?.role !== "ADMIN") {
      if (t?.tasks) {
        updateTask({
          id: params?.id,
          status: "readed",
          title: t.tasks.title,
          description: t.tasks.description,
          creator: t.tasks.creator,
          createAt: t.tasks.createAt,
          deadlines: t.tasks.deadlines,
          priority: t.tasks.priority,
          assignedId: t.tasks.assignedId,
          checked: t.tasks.checked,
        });

        // mutationHistories.mutate({
        //   taskId: params?.id as string,
        //   createAt: new Date(),
        //   content: "đã xem task",
        //   userId: session?.user?.id as string,
        // });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, t]);

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
      mutationHistories.mutate({
        taskId: params?.id as string,
        createAt: new Date(),
        content: `đã tick chọn thực hiện công việc ${arrayTicked.toString()}`,
        userId: session?.user?.id as string,
      });
    }

    if (arrayDeleteTicked?.length > 0) {
      mutationHistories.mutate({
        taskId: params?.id as string,
        createAt: new Date(),
        content: `đã bỏ chọn thực hiện công việc ${arrayDeleteTicked.toString()}`,
        userId: session?.user?.id as string,
      });
    }
  };

  return (
    <>
      {session ? (
        <div
          className="w-full first-letter:max-w-xl mx-auto
           items-center"
        >
          <div className="">
            <div className="text-2xl font-semibold mb-4">
              Chi tiết công việc
            </div>
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
                                  ) : t?.tasks?.status === "readed" ? (
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

                <div className="text-xl font-semibold">Image</div>
                <section className="border border-gray-100 p-5 rounded-xl shadow-md max-w-xl">
                  <div
                    {...getRootProps()}
                    className="p-2 border border-dashed border-gray-300"
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                      <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
                      {isDragActive ? (
                        <p>Drop the files here ...</p>
                      ) : (
                        <p>Drag & drop files here, or click to select files</p>
                      )}
                    </div>
                  </div>
                  {/* Accepted files */}
                  <h3 className="title text-lg font-semibold text-neutral-600 mt-4 border-b pb-3">
                    Accepted Files
                  </h3>
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                    {(t?.tasks?.medias?.length as number) > 0 &&
                      t?.tasks?.medias.map((item, index) => (
                        <li key={index} className="relative h-auto rounded-md">
                          {loading ? (
                            <svg
                              className="absolute top-[-10px] sm:right-0 right-[156px] animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                            <>
                              <img
                                src={item.url}
                                alt={item.url}
                                className="h-full w-full object-contain rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  deleteImage({ id: item.id });
                                }}
                                className="w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-black"
                              >
                                <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    {files.map((file: FileWithPreview, index) => (
                      <li key={index} className="relative h-auto rounded-md">
                        {file.loading ? (
                          <svg
                            className="absolute top-[-10px] sm:right-0 right-[156px] animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                          <>
                            <img
                              src={file.preview}
                              alt={file.name}
                              onLoad={() => {
                                URL.revokeObjectURL(file.preview as string);
                              }}
                              className="h-full w-full object-contain rounded-md"
                            />
                            <button
                              type="button"
                              className="w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-black"
                              onClick={() => removeFile(file.path as string)}
                            >
                              <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                            </button>
                          </>
                        )}
                        <div className=" text-neutral-500 text-[12px] font-medium">
                          {/* {file.path} */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
                <Button type="submit">
                  Submit{isUpdateOnlyChecked ? "ing..." : ""}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      ) : null}
    </>
  );
}

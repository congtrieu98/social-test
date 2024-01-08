/* eslint-disable @next/next/no-async-client-component */
"use client";

import { trpc } from "@/lib/trpc/client";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

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
          onSuccess();
        }
      },
    });

  const { mutate: deleteImage, isLoading: isImageDeleting } =
    trpc.medias.deleteMedia.useMutation({
      onSuccess: () => {
        isImageDeleting ? setLoading(true) : setLoading(false);
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
          checked: t.tasks.checked,
        });
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
  };
  return (
    <>
      {session ? (
        <div className="max-w-xl mx-auto items-center">
          <div className="text-2xl font-semibold mb-4">Chi tiết công việc</div>
          <div className="pb-3 border-b mb-8">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{t?.tasks?.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-2 mb-4">
                      <p className="text-base font-medium leading-none">
                        Thời gian bắt đầu
                      </p>
                      <p className="text-sm font-medium leading-none">
                        {moment(t?.tasks?.createAt, formatDateFull).format(
                          formatDatetime
                        )}
                      </p>
                    </div>
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-2">
                      <p className="text-base font-medium leading-none">
                        Thời gian kết thúc
                      </p>
                      <p className="text-sm font-medium leading-none">
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
          <div className="text-xl font-semibold mb-4">Công việc thực hiện</div>
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
                          console.log(field.value);
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
                                    console.log(checked);
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
      ) : null}
    </>
  );
}

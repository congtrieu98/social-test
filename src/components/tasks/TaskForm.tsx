"use client";

import {
  NewTaskParams,
  insertTaskParams,
  CompleteTask,
} from "@/lib/db/schema/tasks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn, uploadVercel } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CompleteUser } from "@/lib/db/schema/users";
import { Textarea } from "../ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface FileWithPreview extends File {
  preview?: string;
  loading?: boolean;
  path?: string;
}

const TaskForm = ({
  task,
  closeModal,
}: {
  task?: CompleteTask;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!task?.id;
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const { data: data } = trpc.users.getUsers.useQuery();

  const form = useForm<z.infer<typeof insertTaskParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertTaskParams),
    defaultValues: task ?? {
      title: "",
      description: "",
      status: "",
      note: "",
      assignedId: "",
      priority: "",
      creator: session?.user?.id,
      createAt: new Date(),
      deadlines: new Date(),
    },
  });

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

  const mutation = trpc.medias.createMedia.useMutation();
  const { mutate: createTask, isLoading: isCreating } =
    trpc.tasks.createTask.useMutation({
      onSuccess: async ({ task }) => {
        if (files.length > 0 && task) {
          files.forEach((file: FileWithPreview) => {
            if (file.preview) {
              const taskId = task.id;
              mutation.mutate({ taskId: taskId, url: file.preview });
            }
          });
          onSuccess("create");
        }
      },
    });

  const { mutate: updateTask, isLoading: isUpdating } =
    trpc.tasks.updateTask.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteTask, isLoading: isDeleting } =
    trpc.tasks.deleteTask.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewTaskParams) => {
    if (editing) {
      updateTask({ ...values, id: task.id });
    } else {
      // console.log(values)
      createTask(values);
    }
  };

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    editing &&
                    session?.user?.email !== "trieunguyen2806@gmail.com"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    editing &&
                    session?.user?.email !== "trieunguyen2806@gmail.com"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mức độ ưu tiên</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mức độ ưu tiên công việc" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hight" spellCheck>
                    Cao
                  </SelectItem>
                  <SelectItem value="medium">Bình thường</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new" spellCheck>
                    Mới tạo
                  </SelectItem>
                  {/* <SelectItem value="readed">Đã xem</SelectItem> */}
                  <SelectItem value="inprogress">Đang thực hiện</SelectItem>
                  <SelectItem value="reject">Chưa hoàn thành</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {session?.user?.email === "trieunguyen2806@gmail.com" && (
          <FormField
            control={form.control}
            name="assignedId"
            // @ts-ignore
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Người thực hiện</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn người thực hiện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        // @ts-ignore
                        data?.users?.map((user: CompleteUser) => (
                          <SelectItem value={user.id} key={user.id}>
                            {user.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
        <FormField
          control={form.control}
          name="createAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create At</FormLabel>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={
                        editing &&
                        session?.user?.email !== "trieunguyen2806@gmail.com"
                      }
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadlines"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadlines</FormLabel>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={
                        editing &&
                        session?.user?.email !== "trieunguyen2806@gmail.com"
                      }
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">Image</div>
        <section className="border border-gray-100 p-5 rounded-xl shadow-md">
          <div {...getRootProps()}>
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
          <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
            Accepted Files
          </h3>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {
              // @ts-ignore
              task?.medias.length > 0 &&
                task?.medias.map((item, index) => (
                  <li
                    key={index}
                    className="relative h-[100px] rounded-md shadow-lg"
                  >
                    {item.loading ? (
                      <svg
                        className="absolute top-10 right-6 animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                      <img
                        src={item.url}
                        alt={item.url}
                        className="h-[100px] w-[100px] object-contain rounded-md"
                      />
                    )}
                    {/* <FeedAlert id={item?.id} feed={feed} /> */}
                  </li>
                ))
            }
            {files.map((file: FileWithPreview, index) => (
              <li
                key={index}
                className="relative h-[100px] rounded-md shadow-lg"
              >
                {file.loading ? (
                  <svg
                    className="absolute top-10 right-6 animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                  <img
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview as string);
                    }}
                    className="h-[100px] w-[100px] object-contain rounded-md"
                  />
                )}

                <button
                  type="button"
                  className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-red-500"
                  onClick={() => removeFile(file.path as string)}
                >
                  <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                </button>
                <div className=" text-neutral-500 text-[12px] font-medium">
                  {/* {file.path} */}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Type your message here." />
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
        {session?.user.role === "ADMIN" && editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteTask({ id: task.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TaskForm;

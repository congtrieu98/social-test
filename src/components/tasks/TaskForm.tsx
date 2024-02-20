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
import { useEffect, useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import InputForm from "../general/form/inputForm";
import SelectedForm from "../general/form/selectedForm";
import {
  DATAPRIORITY,
  DATASTATUS,
  ROLE,
  STATUS_IMAGE,
  formatDateFull,
  formatDatetime,
  formatNo,
} from "@/utils/constant";
import DateForm from "../general/form/dateForm";
import UploadImage from "../taskDetail/uploadImage";
import moment from "moment";

interface FileWithPreview extends File {
  preview?: string;
  loading?: boolean;
  path?: string;
}

const TaskForm = ({
  task,
  closeModal,
  curenToken,
}: {
  task?: CompleteTask;
  closeModal: () => void;
  curenToken: string;
}) => {
  const { toast } = useToast();

  const editing = !!task?.id;
  const [files, setFiles] = useState<File[]>([]);
  const [job, setJob] = useState("");
  const [jobs, setJobs] = useState<string[]>(
    (task?.description as string[]) || []
  );
  const [dateStart, setDateStart] = useState<string>(
    moment().format(formatDatetime).toString()
  );
  const [dateDue, setDateDue] = useState<string>(
    moment().format(formatDatetime).toString()
  );
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const { data: dataUser } = trpc.users.getUsers.useQuery();
  const inputRef = useRef(null);

  const form = useForm<z.infer<typeof insertTaskParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertTaskParams),
    defaultValues: task ?? {
      title: undefined,
      status: "",
      assignedId: undefined,
      priority: undefined,
      checked: [""] as string[],
      description: jobs,
      creator: session?.user?.id,
      createAt: moment(dateStart).toDate(),
      deadlines: moment(dateDue).toDate(),
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

  const { mutate: createMedia } = trpc.medias.createMedia.useMutation();
  const { mutate: createHistory } = trpc.histories.createHistory.useMutation();
  const { mutate: createTask, isLoading: isCreating } =
    trpc.tasks.createTask.useMutation({
      onSuccess: async ({ task }) => {
        if (files.length > 0 && task) {
          files.forEach((file: FileWithPreview) => {
            if (file.preview) {
              const taskId = task.id;
              createMedia({
                taskId: taskId,
                url: file.preview,
                status: STATUS_IMAGE.ACTIVE,
                createAt: new Date(),
                updateAt: new Date(),
                userId: session?.user?.name as string,
              });
            }
          });
        }
        if (task) {
          createHistory({
            taskId: task?.id as string,
            createAt: new Date(),
            content: "đã tạo task ",
            action: "create",
            userId: session?.user?.name as string,
          });
        }
        onSuccess("create");
      },
    });

  const { mutate: updateTask, isLoading: isUpdating } =
    trpc.tasks.updateTask.useMutation({
      onSuccess: async ({ task }) => {
        if (files.length > 0 && task) {
          files.forEach((file: FileWithPreview) => {
            if (file.preview) {
              const taskId = task.id;
              createMedia({
                taskId: taskId,
                url: file.preview,
                status: STATUS_IMAGE.ACTIVE,
                createAt: new Date(),
                updateAt: new Date(),
                userId: session?.user?.name as string,
              });
            }
          });
        }
        onSuccess("update");
      },
    });

  const { mutate: deleteTask, isLoading: isDeleting } =
    trpc.tasks.deleteTask.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewTaskParams) => {
    if (editing) {
      values.description = jobs;
      values.createAt = moment(dateStart).toDate();
      values.deadlines = moment(dateDue).toDate();
      console.log(values);
      // updateTask({ ...values, id: task.id });
    } else {
      values.description = jobs;
      values.createAt = moment(dateStart).toDate();
      values.deadlines = moment(dateDue).toDate();
      values.tokenNoticafition = curenToken;
      createTask(values);
    }
  };

  const handleAddJobDescription = () => {
    if (job) {
      // @ts-ignore
      setJobs((prev) => [...prev, job]);
      // @ts-ignore
      inputRef.current?.focus();
      setJob("");
    }
  };

  const handleEnterKeyPress = (event: { preventDefault: any; key: string }) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (job) {
        // @ts-ignore
        setJobs((prev) => [...prev, job]);
        // @ts-ignore
        inputRef.current?.focus();
        setJob("");
      }
    }
  };

  const handleDeleteJob = (job: string) => {
    if (jobs.length > 0) {
      setJobs((prev) => prev.filter((item) => item !== job));
    }
  };

  useEffect(() => {
    return () =>
      files.forEach((file: FileWithPreview) =>
        URL.revokeObjectURL(file.preview as string)
      );
  }, [files]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <InputForm
          //@ts-ignore
          form={form}
          title={"Tên công việc"}
          name="title"
        />
        <SelectedForm
          //@ts-ignore
          form={form}
          title={"Mức độ ưu tiên"}
          dataOption={DATAPRIORITY}
          name="priority"
          placeholder="Chọn mức độ ưu tiên"
        />

        <SelectedForm
          //@ts-ignore
          form={form}
          title={"Status"}
          dataOption={DATASTATUS}
          editing={editing as boolean}
          name="status"
          placeholder="Chọn status"
        />
        {session?.user?.role === ROLE.ADMIN && (
          <SelectedForm
            //@ts-ignore
            form={form}
            title={"Người thực hiện"}
            //@ts-ignore
            dataUser={dataUser}
            name="assignedId"
            placeholder="Chọn người thực hiện"
          />
        )}

        <DateForm
          //@ts-ignore
          form={form}
          title="Start"
          date={
            // task?.createAt
            //   ? moment(task?.createAt).format(formatNo).toString()
            //   :
            dateStart
          }
          setDate={setDateStart}
          editing={editing}
          name="createAt"
        />

        <DateForm
          //@ts-ignore
          form={form}
          title="Due"
          date={
            // task?.deadlines
            //   ? moment(task?.deadlines).format(formatNo).toString()
            //   :
            dateDue
          }
          setDate={setDateDue}
          editing={editing}
          name="deadlines"
        />
        {session?.user?.role === ROLE.ADMIN && (
          <UploadImage
            // @ts-ignore
            t={task}
            taskId={task?.id as string}
            files={files}
            setFiles={setFiles}
          />
        )}

        {session?.user?.role === ROLE.ADMIN && (
          <>
            <h1>Description</h1>
            <ul>
              {jobs.map((job, index) => (
                <div key={index} className="flex space-x-4">
                  <li className="max-w-md">- {job}</li>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleDeleteJob(job)}
                  >
                    <TiDelete />
                  </div>
                </div>
              ))}
            </ul>
            <div className="flex w-full">
              <input
                ref={inputRef}
                type="text"
                className="border border-solid border-gray-100 w-full outline-none shadow-sm p-2"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                onKeyDown={handleEnterKeyPress}
              />
              <div
                className="bg-gray-200 py-2 px-4 cursor-pointer"
                onClick={handleAddJobDescription}
              >
                Add
              </div>
            </div>
          </>
        )}

        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {session?.user.role === ROLE.ADMIN && editing ? (
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

"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TiDelete } from "react-icons/ti";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { CompleteTask } from "@/lib/db/schema/tasks";
import { trpc } from "@/lib/trpc/client";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

const AddTaskPractices = ({ task, hidden }: { task: CompleteTask, hidden: boolean }) => {
  const utils = trpc.useContext()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false);

  const inputRef = useRef(null);

  const [job, setJob] = useState("");
  const [jobs, setJobs] = useState<string[]>([]);

  const { mutate: createHistory } = trpc.histories.createHistory.useMutation();


  const onSuccess = async () => {
    await utils.tasks.getTaskById.invalidate()
    handleChangeModal()
    toast({
      title: 'Success',
      description: 'Add description successfully!'
    })
    createHistory({
      taskId: task?.id as string,
      createAt: new Date(),
      content: "đã thêm Description",
      action: "createDescription",
      userId: session?.user?.name as string,
    })
  }
  const { mutate: updateTask, isLoading: isUpdating } =
    trpc.tasks.updateTask.useMutation({
      onSuccess: () => onSuccess()
    })

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

  const handleDeleteJob = (job: any) => {
    if (jobs.length > 0) {
      setJobs((prev) => prev.filter((item) => item !== job));
    }
  };

  const handleChangeModal = () => {
    setOpen(!open);
    setJobs([]);
  };

  const handleSubmit = () => {
    if (jobs?.length > 0) {
      const dataDes = task.description.concat(jobs)
      task.description = dataDes
      // console.log("dataUp:", { ...task })
      updateTask({ ...task })
    }
  };
  return (
    <>
      <Dialog onOpenChange={handleChangeModal} open={open}>
        <DialogTrigger asChild>
          <div className="text-center">
            <h3 className="inline-flex space-x-2 mt-2 text-sm font-semibold text-gray-900">
              {hidden && <div>No Description</div>}
              <PlusCircle className="cursor-pointer" />
            </h3>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>Add Description</DialogTitle>
          </DialogHeader>
          <div className="px-5 pb-5">
            {/* <h1>Description</h1> */}
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
            <div className="flex w-full mt-2 mb-4">
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
            <Button onClick={handleSubmit}>
              {isUpdating ? 'Submiting...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTaskPractices;

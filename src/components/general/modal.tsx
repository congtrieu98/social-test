"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TaskDetailForm } from "../tasks/TaskDetailForm";

export default function Modal({ userSelected }: { userSelected?: string }) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className="w-auto py-2 px-4 flex"
        >
          {"Description"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{"Create"} Task detail</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <TaskDetailForm
            closeModal={closeModal}
            userSelected={userSelected as string}
          />
          {/* <TaskForm closeModal={closeModal} task={task} /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

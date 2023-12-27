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
import { TaskUpdate } from "@/lib/db/schema/taskUpdates";
import TaskUpForm from "./TaskUpForm";

export default function TaskUpModal({
  taskUp,
}: {
  taskUp?: TaskUpdate;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!taskUp?.id;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
          <Button
            variant={editing ? "ghost" : "outline"}
            size={editing ? "sm" : "icon"}
            className="w-auto py-2 px-4"
          >
            Xóa
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Bạn chắc chắn muốn xóa?</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <TaskUpForm closeModal={closeModal} taskUp={taskUp} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

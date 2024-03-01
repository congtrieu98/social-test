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
// import TaskForm from "./TaskForm";
import { CompleteStaff } from "@/lib/db/schema/staffs";
import StaffForm from "./staffForm";

// import { RequestPermission } from "@/utils/hook/notifications";

export default function StaffModal({
  staff,
  emptyState,
}: {
  staff?: CompleteStaff;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const editing = !!staff?.id;
  // useEffect(() => {
  //   const handlePermission = async () => {
  //     try {
  //       const token = await RequestPermission();
  //       setCurenToken(token as string);
  //     } catch (error) {
  //       console.error("Error getting curenToken:", error);
  //     }
  //   };
  //   handlePermission();
  // }, []);

  // console.log("curenToken taskModal:", curenToken);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button className="ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Staff
          </Button>
        ) : (
          <Button
            variant={editing ? "ghost" : "outline"}
            size={editing ? "sm" : "icon"}
            className="w-auto py-2 px-4"
          >
            {editing ? "Edit" : "New Staff"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Staff</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <StaffForm closeModal={closeModal} staff={staff} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

import { CompleteMedia } from "@/lib/db/schema/medias";

export default function Modal({ media }: { media: CompleteMedia }) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <img src={media.url} className="w-24 h-24 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5"></DialogHeader>
        <img src={media.url} className="w-full h-full" />
      </DialogContent>
    </Dialog>
  );
}

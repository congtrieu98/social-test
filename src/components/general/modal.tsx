/* eslint-disable @next/next/no-img-element */
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { CompleteTask } from "@/lib/db/schema/tasks";
import { STATUS_IMAGE } from "@/utils/constant";

export default function Modal({ content, task }: { content: string, task: CompleteTask }) {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <div className="inline cursor-pointer sm:hover:underline underline sm:hover:text-red-400 text-red-400">{content}</div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="px-5 pt-5">
                    <DialogTitle>Ảnh đã xóa</DialogTitle>
                </DialogHeader>
                <Carousel>
                    <CarouselContent>
                        <div className="p-1">
                            {task?.medias
                                .filter((item) => item?.status === STATUS_IMAGE.DISABLE)
                                .map((med, index) => {
                                    return <div key={index}>
                                        <CarouselItem key={index}>

                                            <img src={med?.url} alt="" />;
                                        </CarouselItem>
                                    </div>
                                })}
                        </div>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </DialogContent>
        </Dialog>
    );
}

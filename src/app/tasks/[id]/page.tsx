'use client'

import { trpc } from "@/lib/trpc/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function TaskDetail({ params }: { params: { id: string } }) {
    const { data: session } = useSession()
   
    const { data: t } = trpc.tasks.getTaskById.useQuery({id: params?.id})
    const {mutate: createTaskUpdate} = trpc.taskUpdates.createTaskUpdate.useMutation()

    useEffect(() => {
        if (params?.id && session?.user?.email !== 'trieunguyen2806@gmail.com') {
            console.log('vao day')
            createTaskUpdate(
                {
                    status: 'readed',
                    updateAt: new Date(),
                    updateBy: t?.tasks?.assignedId as string,
                    taskId: params?.id
                }
            )
        } 
    },[params?.id])
    
    return (
        <>
            <div className="text-xl font-semibold">Chi tiết công việc</div>
            <h1>{t?.tasks?.note}</h1>
        </>
    );
}

export default TaskDetail;

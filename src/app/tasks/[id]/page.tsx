/* eslint-disable @next/next/no-async-client-component */
'use client'

import { TaskUpdate } from "@/lib/db/schema/taskUpdates";
import { trpc } from "@/lib/trpc/client";
import { checkUserLogin } from "@/utils/auth/utlis";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TaskDetail({ params }: { params: { id: string } }) {
    checkUserLogin()
    const { data: session } = useSession()
    const { data: t } = trpc.tasks.getTaskById.useQuery({ id: params?.id })
    console.log(t)
    const { mutate: createTaskUpdate } = trpc.taskUpdates.createTaskUpdate.useMutation()
    useEffect(() => {
        if (params?.id && session?.user?.email !== 'trieunguyen2806@gmail.com') {
            console.log('vao day')
            console.log(t)
            if (t?.tasks) {
                const checktTaskUp = t?.tasks?.taskUpdates?.some((item: TaskUpdate) => item?.taskId === t?.tasks?.id)
                if (!checktTaskUp) {
                    return createTaskUpdate(
                        {
                            status: 'readed',
                            updateAt: new Date(),
                            updateBy: session?.user?.id as string,
                            taskId: params?.id as string
                        }
                    )
                }

            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id, t])

    return (
        <>
            {session ? (
                <>
                    <div className="text-xl font-semibold">Chi tiết công việc</div>
                    <h1>{t?.tasks?.note}</h1>
                </>
            ) :
                null}
        </>
    );
}

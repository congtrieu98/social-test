/* eslint-disable @next/next/no-async-client-component */
"use client";

import { trpc } from "@/lib/trpc/client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TaskDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });
  const { data: t } = trpc.tasks.getTaskById.useQuery({ id: params?.id });
  const { mutate: updateTask } = trpc.tasks.updateTask.useMutation();
  useEffect(() => {
    if (params?.id && session?.user?.role !== "ADMIN") {
      if (t?.tasks) {
        // const checktTaskUp = t?.tasks?.todoList?.some(
        //   (item: TaskUpdate) => item?.taskId === t?.tasks?.id
        // );
        // if (!checktTaskUp) {
        return updateTask({
          id: params?.id,
          status: "readed",
          title: t.tasks.title,
          description: t.tasks.description,
          note: t.tasks.note,
          creator: t.tasks.creator,
          createAt: t.tasks.createAt,
          deadlines: t.tasks.deadlines,
          priority: t.tasks.priority,
          assignedId: t.tasks.assignedId,
        });
        // }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, t]);

  return (
    <>
      {session ? (
        <>
          <div className="text-xl font-semibold">Chi tiết công việc</div>
          <h1>{t?.tasks?.note}</h1>
        </>
      ) : null}
    </>
  );
}

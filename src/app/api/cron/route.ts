import { db } from "@/lib/db/index";
import { CompleteTask } from "@/lib/db/schema/tasks";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const t = await db.task.findMany({ include: { user: true } })
    const u = await db.user.findMany()

    const listUserNotAdmin = u.filter(item => ['trieunguyen2806@gmail.com', 'khanh@suzu.vn'].indexOf(item.email as string) === -1 )
    let listTaskByUser: CompleteTask[] = []
    listUserNotAdmin.map(async (user) => {
      listTaskByUser = [];
        t.map((task) => {
          if (user.id === task.user.id) {
            listTaskByUser.push(task)
          }
        })
        const taskCompleted = listTaskByUser.filter((item) => item.status === 'completed')
        const taskUnfinished = listTaskByUser.filter((item) => item.status !== 'completed')

        const percenTaskCompleted = Math.round(((taskCompleted?.length ? taskCompleted?.length : 0) / listTaskByUser?.length) * 100)
        const percenTaskUnfinished = Math.round(((taskUnfinished?.length ? taskUnfinished?.length : 0) / listTaskByUser?.length) * 100)

        const dataReport = {
          assignedTo: user.name as string,
          reportDate: new Date(),
          jobCompleted: taskCompleted?.length,
          jobUnfinished: taskUnfinished?.length,
          jobCompletedPrecent: percenTaskCompleted || 0,
          jobUnfinishedPercent: percenTaskUnfinished || 0,
          kpi: percenTaskCompleted >= 50 ? 'Đạt' : 'Không đạt',
        }

        const result = await db.report.create({ data: dataReport })
        console.log("resultttttttttttt:", result)
        return NextResponse.json({data: result});
    })
  } catch (error) {
    return NextResponse.json({ error: error })
  }
}
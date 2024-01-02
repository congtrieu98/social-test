import { db } from "@/lib/db/index";
import { CompleteTask } from "@/lib/db/schema/tasks";

const getTask = async () => {
  try {
    const t = await db.task.findMany({ include: { user: true } })
    const u = await db.user.findMany()

    let listTaskByUser: CompleteTask[] = []
    u.map(async (user) => {
      if (['trieunguyen2806@gmail.com', 'khanh@suzu.vn'].indexOf(user.email as string) === -1) {
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
        listTaskByUser = []
        console.log("resultttttttttttt:", result)
        return result
      }
    })
  } catch (error) {
    console.log(error)
  }

}

getTask()
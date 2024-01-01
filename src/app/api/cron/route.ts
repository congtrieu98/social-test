import { EmailTemplate } from "@/components/emails/FirstEmail";
import { getUserAuth } from "@/lib/auth/utils";
import { CompleteTask } from "@/lib/db/schema/tasks";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { trpc } from "@/lib/trpc/client";
import { NextResponse } from "next/server";

// export async function GET() {
//   const email = 'trieunguyen2806@gmail.com'
//   const firstName = 'cong trieu suzu'
//   try {
//     const data = await resend.emails.send({
//       from: `SZG <${process.env.RESEND_EMAIL}>`,
//       to: [email],
//       subject: "Hello world Cron Job!",
//       react: EmailTemplate({ firstName: firstName }),
//       text: "Email powered by Resend creon job.",
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error });
//   }
// }

export async function GET(req: Request) {

  const { data: t } = trpc.tasks.getTasks.useQuery()
  const { data: u } = trpc.users.getUsers.useQuery()
  const { mutate: createReport, isLoading: isCreating } = trpc.reports.createReport.useMutation();

  try {
    if (t?.tasks !== undefined) {
      u?.users.map((user) => {
        if (user.role !== 'ADMIN') {
          let taskComplete = []
          let taskUnfinished = []
          t?.tasks.map((item) => {
            if (item?.assignedId === user?.id) {
              if (item?.status === 'completed') {
                taskComplete.push(item)
              } else {
                taskUnfinished.push(item)
              }
            }
          })

          const percenTaskCompleted = Math.round((taskComplete?.length / t.tasks?.length) * 100)
          const percenTaskUnfinished = Math.round((taskUnfinished?.length / t.tasks?.length) * 100)
          createReport({
            assignedTo: user.name as string,
            reportDate: new Date(),
            jobCompleted: taskComplete?.length,
            jobUnfinished: taskUnfinished?.length,
            jobCompletedPrecent: percenTaskCompleted,
            jobUnfinishedPercent: percenTaskUnfinished,
            kpi: percenTaskCompleted >= 50 ? 'Đạt' : 'Không đạt',
          })
          taskComplete = []
          taskUnfinished = []
        }
      })
    }

  } catch (error) {
    return NextResponse.json({ error });
  }
}

/* eslint-disable react-hooks/exhaustive-deps */
// 'use client'
import { EmailTemplate } from "@/components/emails/FirstEmail";
import { resend } from "@/lib/email/index";
import { trpc } from "@/lib/trpc/client";
import { NextResponse } from "next/server";
// import { useEffect } from "react";
import {
  createReport
} from "@/lib/api/reports/mutations";

export async function GET() {
  const email = 'trieunguyen2806@gmail.com'
  const firstName = 'cong trieu suzu 02/01/2024'
  try {
    const data = await resend.emails.send({
      from: `SZG <${process.env.RESEND_EMAIL}>`,
      to: [email],
      subject: "Hello world Cron Job!",
      react: EmailTemplate({ firstName: firstName }),
      text: "Email powered by Resend creon job.",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(req: Request) {

  const { data: t } = trpc.tasks.getTasks.useQuery()
  const { data: u } = trpc.users.getUsers.useQuery()
  // const { mutate: createReport, isLoading: isCreating } = trpc.reports.createReport.useMutation();
try {
  if (t?.tasks !== undefined) {
    u?.users.map(async (user) => {
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

        const percenTaskCompleted = Math.round(((taskComplete?.length ? taskComplete?.length : 0) / t.tasks?.length) * 100)
        const percenTaskUnfinished = Math.round(((taskUnfinished?.length ? taskUnfinished?.length : 0) / t.tasks?.length) * 100)
        const { report, error } = await createReport({
          assignedTo: user.name as string,
          reportDate: new Date(),
          jobCompleted: taskComplete?.length,
          jobUnfinished: taskUnfinished?.length,
          jobCompletedPrecent: percenTaskCompleted || 0,
          jobUnfinishedPercent: percenTaskUnfinished || 0,
          kpi: percenTaskCompleted >= 50 ? 'Đạt' : 'Không đạt',
        });
        taskComplete = []
        taskUnfinished = []
        if (error) return NextResponse.json({ error }, { status: 500 });
        return NextResponse.json(report, { status: 201 });
        // createReport()
      }
    })
  }
} catch (error) {
  
}
    

}

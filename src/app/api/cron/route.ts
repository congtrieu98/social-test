
import { EmailTemplate } from "@/components/emails/FirstEmail";
import { createReport } from "@/lib/api/reports/mutations";
import { Report } from "@/lib/db/schema/reports";
import { resend } from "@/lib/email/index";
import { NextResponse } from "next/server";

export async function GET() {
  const email = 'trieunguyen2806@gmail.com'
  const firstName = 'cong trieu suzu tesst dataatttt'
  
  try {
    const { report } = await createReport({
      assignedTo: 'trieukaaaatttt',
      reportDate: new Date(),
      jobCompleted: 1,
      jobUnfinished: 2,
      jobCompletedPrecent:3,
      jobUnfinishedPercent: 4,
      kpi: 'dat'
  });
    const data = await resend.emails.send({
      from: `SZG <${process.env.RESEND_EMAIL}>`,
      to: [email],
      subject: "Hello world Cron Job!",
      react: EmailTemplate({ firstName: firstName, report: report as Report }),
      text: "Email powered by Resend creon job.",
    });

   
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}


import { EmailTemplate } from "@/components/emails/FirstEmail";
import { createReport } from "@/lib/api/reports/mutations";
import { Report } from "@/lib/db/schema/reports";
import { resend } from "@/lib/email/index";
import { trpc } from "@/lib/trpc/client";
import { NextResponse } from "next/server";

export async function GET() {
  const email = 'trieunguyen2806@gmail.com'
  const firstName = 'cong trieu suzu 02/01/200024'
//   const { report, error } = await createReport({
//     assignedTo: 'trieuka',
//     reportDate: new Date(),
//     jobCompleted: 1,
//     jobUnfinished: 2,
//     jobCompletedPrecent:3,
//     jobUnfinishedPercent: 4,
//     kpi: 'dat'
// });
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

}

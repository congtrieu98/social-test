import { EmailTemplate } from "@/components/emails/FirstEmail";
import { createReport } from "@/lib/api/reports/mutations";
import { Report } from "@/lib/db/schema/reports";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = emailSchema.parse(body);
  try {
    const { report, error } = await createReport({
      assignedTo: 'trieuka',
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
      subject: "Hello world!",
      react: EmailTemplate({ firstName: name, report: report as Report }),
      text: "Email powered by Resend.",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

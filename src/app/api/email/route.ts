// import { EmailTemplate } from "@/components/emails/FirstEmail";
// import { resend } from "@/lib/email/index";
// import { emailSchema } from "@/lib/email/utils";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { name, email } = emailSchema.parse(body);
//   try {
//   //   const { report, error } = await createReport({
//   //     assignedTo: 'trieuka',
//   //     reportDate: new Date(),
//   //     jobCompleted: 1,
//   //     jobUnfinished: 2,
//   //     jobCompletedPrecent:3,
//   //     jobUnfinishedPercent: 4,
//   //     kpi: 'dat'
//   // });
//     const data = await resend.emails.send({
//       from: `SZG <${process.env.RESEND_EMAIL}>`,
//       to: [email],
//       subject: "Hello world!",
//       react: EmailTemplate({ firstName: name }),
//       text: "Email powered by Resend.",
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error });
//   }
// }

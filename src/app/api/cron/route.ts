import { EmailTemplate } from "@/components/emails/FirstEmail";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const email = 'trieunguyen2806@gmail.com'
  const firstName = 'cong trieu suzu'
  try {
    const data = await resend.emails.send({
      from: `SZG <${process.env.RESEND_EMAIL}>`,
      to: [email],
      subject: "Hello world!",
      react: EmailTemplate({ firstName: firstName }),
      text: "Email powered by Resend creon job.",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

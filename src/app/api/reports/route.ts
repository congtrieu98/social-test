import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createReport,
  deleteReport,
  updateReport,
} from "@/lib/api/reports/mutations";
import { 
  reportIdSchema,
  insertReportParams,
  updateReportParams
} from "@/lib/db/schema/reports";

export async function POST(req: Request) {
  try {
    const validatedData = insertReportParams.parse(await req.json());
    const { report, error } = await createReport(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/reports"); // optional - assumes you will have named route same as entity
    return NextResponse.json(report, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateReportParams.parse(await req.json());
    const validatedParams = reportIdSchema.parse({ id });

    const { report, error } = await updateReport(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = reportIdSchema.parse({ id });
    const { report, error } = await deleteReport(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

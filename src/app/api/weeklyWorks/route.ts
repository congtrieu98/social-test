import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createWeeklyWork,
  deleteWeeklyWork,
  updateWeeklyWork,
} from "@/lib/api/weeklyWorks/mutations";
import { 
  weeklyWorkIdSchema,
  insertWeeklyWorkParams,
  updateWeeklyWorkParams 
} from "@/lib/db/schema/weeklyWorks";

export async function POST(req: Request) {
  try {
    const validatedData = insertWeeklyWorkParams.parse(await req.json());
    const { weeklyWork, error } = await createWeeklyWork(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/weeklyWorks"); // optional - assumes you will have named route same as entity
    return NextResponse.json(weeklyWork, { status: 201 });
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

    const validatedData = updateWeeklyWorkParams.parse(await req.json());
    const validatedParams = weeklyWorkIdSchema.parse({ id });

    const { weeklyWork, error } = await updateWeeklyWork(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(weeklyWork, { status: 200 });
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

    const validatedParams = weeklyWorkIdSchema.parse({ id });
    const { weeklyWork, error } = await deleteWeeklyWork(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(weeklyWork, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createWeeklyWorkDefault,
  deleteWeeklyWorkDefault,
  updateWeeklyWorkDefault,
} from "@/lib/api/weeklyWorkDefaults/mutations";
import { 
  weeklyWorkDefaultIdSchema,
  insertWeeklyWorkDefaultParams,
  updateWeeklyWorkDefaultParams 
} from "@/lib/db/schema/weeklyWorkDefaults";

export async function POST(req: Request) {
  try {
    const validatedData = insertWeeklyWorkDefaultParams.parse(await req.json());
    const { weeklyWorkDefault, error } = await createWeeklyWorkDefault(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/weeklyWorkDefaults"); // optional - assumes you will have named route same as entity
    return NextResponse.json(weeklyWorkDefault, { status: 201 });
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

    const validatedData = updateWeeklyWorkDefaultParams.parse(await req.json());
    const validatedParams = weeklyWorkDefaultIdSchema.parse({ id });

    const { weeklyWorkDefault, error } = await updateWeeklyWorkDefault(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(weeklyWorkDefault, { status: 200 });
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

    const validatedParams = weeklyWorkDefaultIdSchema.parse({ id });
    const { weeklyWorkDefault, error } = await deleteWeeklyWorkDefault(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(weeklyWorkDefault, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

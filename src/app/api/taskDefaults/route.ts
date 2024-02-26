import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createTaskDefault,
  deleteTaskDefault,
  updateTaskDefault,
} from "@/lib/api/taskDefaults/mutations";
import { 
  taskDefaultIdSchema,
  insertTaskDefaultParams,
  updateTaskDefaultParams 
} from "@/lib/db/schema/taskDefaults";

export async function POST(req: Request) {
  try {
    const validatedData = insertTaskDefaultParams.parse(await req.json());
    const { taskDefault, error } = await createTaskDefault(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/taskDefaults"); // optional - assumes you will have named route same as entity
    return NextResponse.json(taskDefault, { status: 201 });
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

    const validatedData = updateTaskDefaultParams.parse(await req.json());
    const validatedParams = taskDefaultIdSchema.parse({ id });

    const { taskDefault, error } = await updateTaskDefault(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(taskDefault, { status: 200 });
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

    const validatedParams = taskDefaultIdSchema.parse({ id });
    const { taskDefault, error } = await deleteTaskDefault(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(taskDefault, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

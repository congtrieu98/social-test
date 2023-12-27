import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createTaskUpdate,
  deleteTaskUpdate,
  updateTaskUpdate,
} from "@/lib/api/taskUpdates/mutations";
import {
  taskUpdateIdSchema,
  insertTaskUpdateParams,
  updateTaskUpdateParams
} from "@/lib/db/schema/taskUpdates";

export async function POST(req: Request) {
  try {
    const validatedData = insertTaskUpdateParams.parse(await req.json());
    // @ts-ignore
    const { taskUpdate, error } = await createTaskUpdate(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/taskUpdates"); // optional - assumes you will have named route same as entity
    return NextResponse.json(taskUpdate, { status: 201 });
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

    const validatedData = updateTaskUpdateParams.parse(await req.json());
    const validatedParams = taskUpdateIdSchema.parse({ id });

    const { taskUpdate, error } = await updateTaskUpdate(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(taskUpdate, { status: 200 });
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

    const validatedParams = taskUpdateIdSchema.parse({ id });
    const { taskUpdate, error } = await deleteTaskUpdate(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(taskUpdate, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

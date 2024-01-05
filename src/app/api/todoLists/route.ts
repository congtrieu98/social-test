import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createTodoList,
  deleteTodoList,
  updateTodoList,
} from "@/lib/api/todoLists/mutations";
import { 
  todoListIdSchema,
  insertTodoListParams,
  updateTodoListParams 
} from "@/lib/db/schema/todoLists";

export async function POST(req: Request) {
  try {
    const validatedData = insertTodoListParams.parse(await req.json());
    const { todoList, error } = await createTodoList(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/todoLists"); // optional - assumes you will have named route same as entity
    return NextResponse.json(todoList, { status: 201 });
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

    const validatedData = updateTodoListParams.parse(await req.json());
    const validatedParams = todoListIdSchema.parse({ id });

    const { todoList, error } = await updateTodoList(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(todoList, { status: 200 });
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

    const validatedParams = todoListIdSchema.parse({ id });
    const { todoList, error } = await deleteTodoList(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(todoList, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

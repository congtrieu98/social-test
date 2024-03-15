import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createTool,
  deleteTool,
  updateTool,
} from "@/lib/api/tools/mutations";
import { 
  toolIdSchema,
  insertToolParams,
  updateToolParams 
} from "@/lib/db/schema/tools";

export async function POST(req: Request) {
  try {
    const validatedData = insertToolParams.parse(await req.json());
    const { tool, error } = await createTool(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/tools"); // optional - assumes you will have named route same as entity
    return NextResponse.json(tool, { status: 201 });
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

    const validatedData = updateToolParams.parse(await req.json());
    const validatedParams = toolIdSchema.parse({ id });

    const { tool, error } = await updateTool(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(tool, { status: 200 });
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

    const validatedParams = toolIdSchema.parse({ id });
    const { tool, error } = await deleteTool(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(tool, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

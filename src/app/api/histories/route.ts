import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createHistory,
  deleteHistory,
  updateHistory,
} from "@/lib/api/histories/mutations";
import {
  historyIdSchema,
  insertHistoryParams,
  updateHistoryParams,
} from "@/lib/db/schema/histories";

export async function POST(req: Request) {
  try {
    const validatedData = insertHistoryParams.parse(await req.json());
    //@ts-ignore
    const { history, error } = await createHistory(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/histories"); // optional - assumes you will have named route same as entity
    return NextResponse.json(history, { status: 201 });
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

    const validatedData = updateHistoryParams.parse(await req.json());
    const validatedParams = historyIdSchema.parse({ id });

    const { history, error } = await updateHistory(
      validatedParams.id,
      validatedData
    );

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(history, { status: 200 });
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

    const validatedParams = historyIdSchema.parse({ id });
    const { history, error } = await deleteHistory(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(history, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

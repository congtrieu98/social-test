import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createMedia,
  deleteMedia,
  updateMedia,
} from "@/lib/api/medias/mutations";
import { 
  mediaIdSchema,
  insertMediaParams,
  updateMediaParams 
} from "@/lib/db/schema/medias";

export async function POST(req: Request) {
  try {
    const validatedData = insertMediaParams.parse(await req.json());
    const { media, error } = await createMedia(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/medias"); // optional - assumes you will have named route same as entity
    return NextResponse.json(media, { status: 201 });
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

    const validatedData = updateMediaParams.parse(await req.json());
    const validatedParams = mediaIdSchema.parse({ id });

    const { media, error } = await updateMedia(validatedParams.id, validatedData);

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(media, { status: 200 });
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

    const validatedParams = mediaIdSchema.parse({ id });
    const { media, error } = await deleteMedia(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(media, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

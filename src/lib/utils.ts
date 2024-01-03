import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PutBlobResult } from "@vercel/blob";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadVercel(file: File) {
  const response = await fetch(`/api/upload?filename=${file?.name}`, {
    method: "POST",
    body: file,
  });
  const newBlob = (await response.json()) as PutBlobResult;
  return newBlob.url;
}

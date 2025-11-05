import { deleteFormat, fetchFormats } from "@/app/test/action";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await fetchFormats();
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const formatId = searchParams.get("id");
  await deleteFormat(formatId!);
  console.log("Deleted format with id:", formatId);
}
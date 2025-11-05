import { fetchFormatByName } from "@/app/test/action";
import { NextResponse } from "next/server";

export async function GET(request: Request) 
{
   const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  console.log("Name: "+name);
  const data = await fetchFormatByName(name);
  return NextResponse.json(data);
}
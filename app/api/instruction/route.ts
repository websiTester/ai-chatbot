import { getAllAgents } from "@/mastra/db/agent-service";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getAllAgents();
  return NextResponse.json(data);
}
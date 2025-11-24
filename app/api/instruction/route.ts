import { getAllAgents, updateAgent } from "@/mastra/db/agent-service";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getAllAgents();
  return NextResponse.json(data);
}

export async function PUT(request: Request){
    const body = await request.json(); 
    await updateAgent(body);
   
}
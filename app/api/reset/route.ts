import { updateAgent } from "@/mastra/db/agent-service";
import { getDefaultAgents } from "@/mastra/db/default-service";
import { NextResponse } from "next/server";

export async function PUT() {
  const data = (await getDefaultAgents()).map((agent:any) => {
    return {
        id: agent.id,
        name: agent.name,
        instruction: agent.instruction
    }
  });
  
  data.forEach(async (agent: any) => {
    await updateAgent(agent);
    
  });
}
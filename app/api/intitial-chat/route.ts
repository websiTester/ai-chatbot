
import { NextResponse } from "next/server";
import { convertMessages } from "@mastra/core/agent";
import { mastra } from "@/mastra";

// const myAgent = mastra.getAgent("obsidianAgent");

// export async function GET() {
//   const result = await myAgent.getMemory()?.query({
//     threadId: "user-session",
//   });

//   const messages = convertMessages(result?.uiMessages || []).to("AIV5.UI");
//   return NextResponse.json(messages);
// }
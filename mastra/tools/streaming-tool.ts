import { createTool } from "@mastra/core";
import z from "zod";

export const streamingTool = createTool({
  id: "streaming-tool",
  description: "Phân tích yêu cầu chức năng của 1 website thương mại điện tử",
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
  execute: async ({ context, mastra, writer }) => {
    const { input } = context;
    
    // Sử dụng đúng tên workflow (có dấu gạch ngang)
    const agent = mastra?.getAgent("finalAgent");

    if (!agent) {
      throw new Error("Agent 'finalAgent' not found");
    }

    const stream = await agent.stream([
        { role: "user", content: `Phân tích chức năng của 1 website e-commerce: ${input}` }
    ]);
    await stream!.textStream.pipeTo(writer!);
 
    return {
      text: await stream!.text
    };
  }
});
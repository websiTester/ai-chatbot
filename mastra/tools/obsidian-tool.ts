import { createTool } from "@mastra/core";
import z from "zod";
import { obsidianAgent } from "../agents/obsidian-agent";

export const obsidianTool = createTool({
  id: "obsidian-tool",
  description: "Quản lý ghi chú và thông tin cá nhân trong Obsidian. Thêm, sửa, xóa note trong obsidian dựa trên yêu cầu của người dùng.",
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string()
  }),
  execute: async ({ context, mastra }) => {
    const { input } = context;
    const prompt = `
            Thực hiện yêu cầu sau trong Obsidian: ${input}
        `;
    
        const { text } = await obsidianAgent.generate([
          { role: "user", content: prompt }
        ]);
        return { text };
    
  }
});
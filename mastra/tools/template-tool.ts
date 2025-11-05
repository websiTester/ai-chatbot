import { createTool } from "@mastra/core";
import z from "zod";

export const templateTool = createTool({
  id: "template-tool",
  description: "Phân tích yêu cầu chức năng của 1 website thương mại điện tử dựa trên template người dùng cung cấp",
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string().refine(
    (content) => content.trim().startsWith("#") && content.includes("##"),
    { message: "Output must be valid Markdown with headers" }
  )
  }),
  execute: async ({ context, mastra }) => {
    const { input } = context;
    
    const workflow = mastra?.getWorkflow("getTemplateWorkflow");
    
    if (!workflow) {
      throw new Error("Workflow 'getTemplateWorkflow' not found");
    }
 
    const run = await workflow.createRunAsync();
    
    if (!run) {
      throw new Error("Failed to create workflow run");
    }
 
    const result = await run.start({
      inputData: {
        input
      }
    });
 
    // Kiểm tra status và lấy kết quả phù hợp
    if (result.status === "success") {
      return {
        text: (result as any).result?.text || "No analysis result"
      };
    } else {
      throw new Error(`Workflow failed: ${(result as any).error?.message || "Unknown error"}`);
    }
  }
});
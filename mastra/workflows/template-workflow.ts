import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";
import { templateAgent, templateAnalyzeAgent } from "../agents/ecomerce-agent";

const templateAnalyzeStep = createStep({
  id: "template-markdown",
  description: "Phân tích chức năng website e-commerce và trả về file markdown",
  retries: 3,
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
 
  execute: async ({ inputData }) => {

    //Map input field of inputData into input variable
    const { input } = inputData;

    const prompt = `Phân tích yêu cầu chức năng: ${input} dựa trên template người dùng cung cấp và trả về file markdown hoàn chỉnh với đầy đủ các đầu mục giống với template.
    Quy tắc phản hồi:
      - Phân tích yêu cầu chức năng dựa trên template người dùng cung cấp. 
      - Vẽ diagram bằng Mermaid nếu có phần yêu cầu sơ đồ.
      - Luôn trả kết quả sau khi phân tích về định dạng file Markdown hoàn chỉnh.
      - Không thêm, bớt, chỉnh sửa hay giải thích bất kỳ nội dung nào.
      - Nếu có phần không ở định dạng Markdown → tự động chuyển sang Markdown.
      - Giữ nguyên định dạng gốc (đặc biệt là phần UI/UX).
      - Đảm bảo kết quả cuối cùng là Markdown hợp lệ và hoàn chỉnh 100%.

    `;

    const { text } = await templateAnalyzeAgent.generate([
      { role: "user", content: prompt }
    ]);

    return { text };
  }
});


const templateWorkflow = createWorkflow({
  id: 'ecommerce-workflow',
  inputSchema: z.object({
    input: z.string().describe('The topic need to analyze for e-commerce website'),
  }),
  outputSchema: z.object({
    text: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
})
  .then(templateAnalyzeStep);

templateWorkflow.commit();

export { templateWorkflow };
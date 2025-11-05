import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";
import { createAgentWithInstruction, model1, model2, model3, shortMermaidAgent, shortOverviewAgent, shortSummaryAgent, shortUiAgent } from "../agents/short-instruction-agent";
import { getAgentById } from "../db/agent-service";


const shortOverviewStep = createStep({
  id: "generate-markdown",
  description: "Phân tích yêu cầu chức năng dựa trên instruction và trả về file markdown",
  retries: 3,
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string()
  }),
 
  execute: async ({ inputData }) => {

    //Map input field of inputData into input variable
    const { input } = inputData;

    const prompt = `Phân tích chức năng: ${input} trong website e-commerce. Chỉ phân tích các khía cạnh được nêu trong instructions`;

    var {instruction} = await getAgentById(1); 
    var agent = createAgentWithInstruction("Agent 1", instruction, model1)
    const { text } = await agent.generate([
      { role: "user", content: prompt }
    ]);

    return { text };
  }
});

const shortMermaidStep = createStep({
  id: "generate-mermaid",
  description: "Phân tích yêu cầu chức năng dựa trên instruction và trả về file markdown",
  retries: 3,
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string()        
  }),
 
  execute: async ({ inputData }) => {

    //Map input field of inputData into input variable
    const { input } = inputData;

    const prompt = `Phân tích chức năng: ${input} trong website e-commerce. Chỉ phân tích các khía cạnh được nêu trong instructions`;

    var {instruction} = await getAgentById(2); 
    var agent = createAgentWithInstruction("Agent 2", instruction, model2)
    const { text } = await agent.generate([
      { role: "user", content: prompt }
    ]);

    return { text };
  }
});


const shortUiStep = createStep({
  id: "ui-results",
  description: "Phân tích yêu cầu chức năng dựa trên instruction và trả về file markdown",
  retries: 3,
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    text: z.string()
  }),
  execute: async ({ inputData }) => {
    const { input } = inputData;

    const prompt = `
        Phân tích chức năng: ${input} trong website e-commerce. Chỉ phân tích các khía cạnh được nêu trong instructions
    `;

    var {instruction} = await getAgentById(3); 
    var agent = createAgentWithInstruction("Agent 3", instruction, model3
    )
    const { text } = await agent.generate([
      { role: "user", content: prompt }
    ]);

    return { text };
  }
});




const shortSummarizeStep = createStep({
  id: "summarize-results",
  description: "Summarize markdown and mermaid output",
  retries: 3,
  inputSchema: z.object({
    "generate-markdown": z.object({
      text: z.string()
    }),
    "generate-mermaid": z.object({
      text: z.string()
    }),
    "ui-results": z.object({
      text: z.string()
    })
  }),
  outputSchema: z.object({
    text: z.string()
  }),
  execute: async ({ inputData }) => {
    const markdown = inputData["generate-markdown"].text;
    const mermaid = inputData["generate-mermaid"].text;
    const ui = inputData["ui-results"].text;

    const prompt = `
      Kết hợp các phần sau thành một báo cáo markdown thống nhất:
      ---
      Agent 1 content:
      ${markdown}

      Agent 2 content:
      ${mermaid}

      Agent 3 content:
      ${ui}

      Yêu cầu:
       - Chỉ tổng hợp các nội dung đã cho, không tự ý tạo ra nội dung mới.
       - Đảm bảo định dạng markdown hoàn chỉnh, có cấu trúc rõ ràng và dễ đọc.
       - Nếu có thông tin trùng lặp, hãy hợp nhất cho mạch lạc nhưng không bỏ sót nội dung nào.
      `;

    const { text } = await shortSummaryAgent.generate([
      { role: "user", content: prompt }
    ]);

    return { text };
  }
});



const shortWorkflow = createWorkflow({
  id: 'ecommerce-workflow',
  inputSchema: z.object({
    input: z.string().describe('The topic need to analyze for e-commerce website'),
  }),
  outputSchema: z.object({
    text: z.string()
  }),
})
  .parallel([shortOverviewStep, shortMermaidStep, shortUiStep])
  .then(shortSummarizeStep);

shortWorkflow.commit();

export { shortWorkflow };
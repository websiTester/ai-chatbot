import { Agent } from "@mastra/core/agent";
import { streamingTool } from "../tools/streaming-tool";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const streamingAgent = new Agent({
  name: 'E-commerce Streaming Agent',
  instructions: `
        Gọi tool streamingTool để phân tích yêu cầu chức năng của 1 website thương mại điện tử và trả về kết quả dạng markdown.
        `,
  model: 'google/gemini-2.0-flash',
  tools: {streamingTool},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
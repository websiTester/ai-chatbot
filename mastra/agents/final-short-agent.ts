import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { analyzeTool } from "../tools/analyze-tool";
import { templateTool } from "../tools/template-tool";
import { getTemplateTool } from "../tools/get-template-tool";
import { shortTool } from "../tools/short-tool";

export const finalShortAgent = new Agent({
  name: 'Short Final Agent',
  instructions: `
        Bạn là AI điều phối phân tích website thương mại điện tử, chịu trách nhiệm gọi và điều phối các agent chuyên trách, không trực tiếp viết nội dung phân tích.
        Nhiệm vụ:
            - Gọi tool tương ứng để phân tích yêu cầu chức năng do người dùng cung cấp.
            - Tổng hợp kết quả phân tích từ các tool thành một file Markdown duy nhất, đầy đủ, chuẩn format.

        Yêu cầu về định dạng phản hồi:
            - Đảm bảo mỗi yêu cầu phân tích trả về một file Markdown duy nhất, đầy đủ, chuẩn format, chứa toàn bộ nội dung hợp nhất từ các agent.
        `,
  model: 'google/gemini-2.0-flash',
  tools: {shortTool},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});

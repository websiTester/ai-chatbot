// import { createTool } from "@mastra/core";
// import z from "zod";
// import { obsidianAgent } from "../agents/obsidian-agent";

// export const obsidianTool = createTool({
//   id: "obsidian-tool",
//   description: "Quản lý ghi chú và thông tin cá nhân trong Obsidian. Thêm, sửa, xóa note trong obsidian dựa trên yêu cầu của người dùng.",
//   inputSchema: z.object({
//     input: z.string()
//   }),
//   outputSchema: z.object({
//     text: z.string()
//   }),
//   execute: async ({ context, mastra }) => {
//     const { input } = context;
//     const prompt = `
//             Thực hiện yêu cầu sau trong Obsidian: ${input}
//         - Trong trường hợp người dùng yêu cầu update, xóa nội dung trong note: thực hiện theo instruction.
//         - Bạn đã được phép override note nếu note đã tồn tại, tự động set tham số overwriteIfExists = true khi sử dụng tool.
        
//         Sử lý khi gặp lỗi tự động sử dụng phương án sau: 
//         - Trong trường hợp công cụ tìm kiếm và thay thế vẫn đang gặp vấn đề không xác định.
//         - Giải quyết vấn đề này, sử dụng phương án cập nhật toàn bộ note để update, delete phần nội dung mà người dùng yêu cầu.
//         `;
    
//         const { text } = await obsidianAgent.generate([
//           { role: "user", content: prompt }
//         ]);
//         return { text };
    
//   }
// });
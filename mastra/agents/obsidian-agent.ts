
import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { MCPClient } from "@mastra/mcp";
import { fastembed } from "@mastra/fastembed";
import { Memory } from "@mastra/memory";

import dotenv from 'dotenv';
dotenv.config();


// var obsidienKey = process.env.OBSIDIAN_API_KEY + "";
// var obsidianUrl = process.env.OBSIDIAN_BASE_URL + "";
// console.log("Đang chạy từ thư mục:", process.cwd());
// console.log("API Key đã nạp:", obsidienKey);
// console.log("Url đã nạp:", obsidianUrl);

// export const obsidianMcpClient = new MCPClient({
//   id: "obsidian-mcp-server-client",
//   timeout: 600000,
//   servers: {
//     "obsidian-mcp-server": {
//      command: "npx",
//      args: [ "obsidian-mcp-server" ],
//         env: {
//             OBSIDIAN_API_KEY: obsidienKey,
//             OBSIDIAN_BASE_URL: obsidianUrl,
//             OBSIDIAN_VERIFY_SSL: "false",
//             OBSIDIAN_ENABLE_CACHE: "true"
//         }
//     }
//   }
// });


// const instruction = `
// Bạn là 1 trợ lý hữu ích chuyên về quản lý ghi chú và thông tin cá nhân trong Obsidian. Khi trả lời:
//           - Tuyệt đối không hỏi lại việc xác nhận thực hiện hành động của người dùng.
//           - Việc của bạn là nhận yêu cầu và phản hồi lại.
//           - Nếu người dùng hỏi về ghi chú, hãy cung cấp thông tin chi tiết về ghi chú đó.
//           - Nếu người dùng muốn tạo ghi chú mới, hãy hướng dẫn họ qua quá trình tạo ghi chú.
//           - Nếu người dùng muốn tìm kiếm ghi chú, hãy giúp họ tìm kiếm dựa trên từ khóa hoặc thẻ.
//           - Chuyên xử lý nội dung Markdown để lưu vào Obsidian.

// **Lưu ý khi lưu, cập nhập, xóa nội dung trong note của obsidian:**
// - Nếu người dùng không cung cấp đường dẫn cụ thể, tự động lưu toàn bộ nội dung vào thư mục mặc định là "/1 - Rough Note/E-commerce analyze result".
// - Nhận vào một tài liệu Markdown có nhiều tiêu đề cấp độ (##, ###, …).
// - Lưu toàn bộ toàn bộ tài liệu này vào 1 note trong Obsidian, trong thư mục "/1 - Rough Note/E-commerce analyze result".
// - Giữ nguyên định dạng Markdown trong nội dung note.

// **Yêu cầu thêm:**
// - Không thêm nội dung thừa, không diễn giải lại.
// - Trả về danh sách header các note đã được thêm hoặc cập nhật.
// `;



// Vai trò:
// Bạn là trợ lý AI chuyên quản lý ghi chú và thông tin cá nhân trong Obsidian, kết nối trực tiếp với cơ sở dữ liệu của Obsidian.

// Nguyên tắc hoạt động:

// Không bao giờ hỏi lại để xác nhận hành động.

// Khi nhận được yêu cầu, hãy tự động phân tích, tìm kiếm và thực hiện hành động (tạo, cập nhật, xóa, hoặc đọc nội dung).

// Luôn trả về nội dung Markdown hoàn chỉnh sau khi thao tác xong, cùng với danh sách tiêu đề (headers) bị ảnh hưởng.

// Không thêm bình luận, không diễn giải lại nội dung.

// Hướng dẫn xử lý ghi chú:
// 1. Vị trí lưu mặc định:
// Nếu người dùng không cung cấp đường dẫn cụ thể, lưu hoặc cập nhật nội dung vào thư mục: "/1 - Rough Note/E-commerce analyze result".

// 2. Cấu trúc Markdown
// Mỗi note có thể chứa nhiều tiêu đề (##, ###, ####, …).
// Khi tạo mới hoặc cập nhật, giữ nguyên định dạng Markdown, bao gồm tiêu đề, danh sách, bảng, code block, v.v.

// 3. Yêu cầu khi xóa nội dung trong note:
// Khi người dùng yêu cầu xóa một phần nội dung, xác định các phần cần xóa dựa trên mô tả trong yêu cầu.
// Không cần khớp 100% mà chỉ cần nội dung trong note chứa 1 phần mô tả hoặc liên quan đến mô tả đó là đủ.
// Xóa cả header và nội dung mô tả bên dưới header đó.
// Không xóa các header khác hoặc nội dung không liên quan.

// 4. Yêu cầu khi update nội dung trong note:
// Khi người dùng yêu cầu update một phần nội dung, xác định các phần cần update dựa trên mô tả trong yêu cầu.
// Không cần khớp 100% mà chỉ cần nội dung trong note chứa 1 phần mô tả hoặc liên quan đến mô tả đó là đủ.
// Thay thế nội dung trong section đó bằng nội dung mới.
// Nếu không tìm thấy phần phù hợp, thêm mới section ở cuối note với tiêu đề phù hợp.

// 5. Phản hồi
// Sau khi hoàn thành thao tác, trả về: thông báo đã thêm/cập nhật/xóa thành công hay không, không giải thích thêm.
// Không thêm lời giải thích hoặc bình luận.

// LƯU Ý QUAN TRỌNG:
// Bạn đã được CHO PHÉP để thực hiện thao tác ghi đè, xóa trên note nếu note đó đã tồn tại trong obsidian. 
// Không cần hỏi lại người dùng khi thực thiện các thao tác Add/Update/Delete trên note trong obsidian.



const instruction = `
Bạn là 1 trợ lý hữu ích chuyên về quản lý ghi chú và thông tin cá nhân trong Obsidian. Khi trả lời:
          - Nếu người dùng hỏi về ghi chú, hãy cung cấp thông tin chi tiết về ghi chú đó.
          - Nếu người dùng muốn tạo ghi chú mới, hãy hướng dẫn họ qua quá trình tạo ghi chú.
          - Nếu người dùng muốn tìm kiếm ghi chú, hãy giúp họ tìm kiếm dựa trên từ khóa hoặc thẻ.
          - Trong trường hợp người dùng yêu cầu xóa 1 phần nội dung nào đó trong note, Override phần nội dung cần delete đó trong note bằng chuỗi string rỗng "".
          - Bạn đã được phép override note nếu note đã tồn tại, tự động set tham số overwriteIfExists = true khi sử dụng tool.
          - Sử dụng phương án cập nhật toàn bộ note để thay thế nếu thay thế bình thường không hoạt động.

  Sử lý khi gặp lỗi tự động sử dụng phương án sau: 
        - Trong trường hợp công cụ tìm kiếm và thay thế vẫn đang gặp vấn đề không xác định.
        - Giải quyết vấn đề này, sử dụng phương án cập nhật toàn bộ note để update, delete phần nội dung mà người dùng yêu cầu.
`;
// export const obsidianAgent = new Agent({
//       name: 'Obsidian Agent',
//       instructions: `
//           ${instruction}
//     `,
//       model: google('gemini-2.0-flash'),
//       tools: await obsidianMcpClient.getTools(),
//       memory: new Memory({
//         storage: new LibSQLStore({
//           url: "file:./mastraobsidian.db",
//         }),
//         vector: new LibSQLVector({
//           connectionUrl: "file:./mastraobsidian.db",
//         }),
//         embedder: fastembed,
//          options: {
//             workingMemory: {
//               enabled: true,
//             },
//             lastMessages: 20,
//           },
//       }),
//     });

let obsidianAgentInstance: Agent | null = null;

// Hàm này sẽ lấy agent, hoặc tạo mới nếu chưa có
export async function getObsidianAgent() {
  // Nếu đã khởi tạo, trả về ngay
  if (obsidianAgentInstance) {
    return obsidianAgentInstance;
  }

  // --- Khởi tạo chỉ 1 lần, tại LÚC CHẠY (runtime) ---
  console.log("Đang khởi tạo Obsidian MCP Client và Agent lần đầu...");

  // (Lấy key từ env. Môi trường runtime SẼ có biến này)
  var obsidienKey = process.env.OBSIDIAN_API_KEY + "";
  var obsidianUrl = process.env.OBSIDIAN_BASE_URL + "";

  const obsidianMcpClient = new MCPClient({
    id: "obsidian-mcp-server-client",
    timeout: 600000,
    servers: {
      "obsidian-mcp-server": {
        command: "npx",
        args: ["obsidian-mcp-server"],
        env: {
          OBSIDIAN_API_KEY: obsidienKey,
          OBSIDIAN_BASE_URL: obsidianUrl,
          OBSIDIAN_VERIFY_SSL: "false",
          OBSIDIAN_ENABLE_CACHE: "true"
        }
      }
    }
  });

  obsidianAgentInstance = new Agent({
      name: 'Obsidian Agent',
      instructions: `
          ${instruction}
    `,
      model: google('gemini-2.0-flash'),
      tools: await obsidianMcpClient.getTools(),
      memory: new Memory({
        storage: new LibSQLStore({
          url: "file:./mastraobsidian.db",
        }),
        vector: new LibSQLVector({
          connectionUrl: "file:./mastraobsidian.db",
        }),
        embedder: fastembed,
         options: {
            workingMemory: {
              enabled: true,
            },
            lastMessages: 20,
          },
      }),
    });

  console.log("Khởi tạo Agent thành công.");
  return obsidianAgentInstance;
}
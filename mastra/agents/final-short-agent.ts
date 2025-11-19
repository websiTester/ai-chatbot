import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { shortTool } from "../tools/short-tool";



const instruction = `
  Bạn là AI điều phối phân tích website thương mại điện tử, chịu trách nhiệm gọi và điều phối các agent chuyên trách, không trực tiếp viết nội dung phân tích.
        Nhiệm vụ:
            - Gọi tool tương ứng để phân tích yêu cầu chức năng do người dùng cung cấp.
            - Tổng hợp kết quả phân tích từ các tool thành một file Markdown duy nhất, đầy đủ, chuẩn format.

        Yêu cầu về định dạng phản hồi:
            - Đảm bảo mỗi yêu cầu phân tích trả về một file Markdown duy nhất, đầy đủ, chuẩn format, chứa toàn bộ nội dung hợp nhất từ các agent.

`;
export const finalShortAgent = new Agent({
  name: 'Short Final Agent',
  instructions: `
        ${instruction}
        `,
  model: 'google/gemini-2.0-flash',
  tools: {shortTool},
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:./mastra.db',
    }),
  }),
});


// let finalShortAgentInstance: Agent | null = null;

// // Hàm này sẽ lấy agent, hoặc tạo mới nếu chưa có
// export async function getFinalShortAgent() {
//   // Nếu đã khởi tạo, trả về ngay
//   if (finalShortAgentInstance) {
//     return finalShortAgentInstance;
//   }


//   finalShortAgentInstance = new Agent({
//       name: 'Short Final Agent',
//       instructions: `
//             ${instruction}
//             `,
//       model: 'google/gemini-2.0-flash',
//       tools: {shortTool},
//       memory: new Memory({
//         storage: new LibSQLStore({
//           url: 'file:./mastra.db',
//         }),
//       }),
//     });

//   return finalShortAgentInstance;
// }




// Bạn là AI điều phối đa năng, chịu trách nhiệm **gọi và điều phối các agent chuyên trách** trong hệ thống.  
// Bạn **không trực tiếp viết nội dung phân tích hay ghi chú**, mà sẽ sử dụng các công cụ (tools) tương ứng để thực hiện yêu cầu của người dùng.

// ---

// ### Nhiệm vụ chính:

// 1. **Phân tích website thương mại điện tử**  
//    - Khi người dùng yêu cầu phân tích hoặc xây dựng chức năng website thương mại điện tử, hãy gọi các tool chuyên trách để thực hiện phân tích chức năng, giao diện, dữ liệu, trải nghiệm người dùng, v.v.  
//    - Sau khi nhận kết quả từ các tool, hãy **tổng hợp thành một file Markdown duy nhất**, đầy đủ, rõ ràng và chuẩn format.

// 2. **Quản lý ghi chú trong Obsidian**  
//    - Khi người dùng yêu cầu thao tác với ghi chú cá nhân, hãy gọi các tool tương ứng để:
//      - Tạo, đọc, sửa, xóa, tìm kiếm hoặc tóm tắt các ghi chú trong Obsidian vault.  
//    - Đảm bảo các thao tác thực hiện chính xác theo yêu cầu của người dùng.

// ---

// ### Nguyên tắc hoạt động:
// - Luôn xác định **ngữ cảnh yêu cầu** trước: đây là yêu cầu **phân tích website** hay **quản lý ghi chú**.  
// - Chỉ **gọi tool phù hợp** cho từng loại tác vụ.  
// - Không tự sinh nội dung mà không qua tool chuyên trách.  
// - Đảm bảo mọi phản hồi cuối cùng đều có **định dạng Markdown chuẩn**, đặc biệt với các file phân tích website.  
// - Giữ phản hồi ngắn gọn, rõ ràng, có cấu trúc.

// ---

// ### Định dạng phản hồi:
// - Với yêu cầu phân tích website:  
//   → Trả về **một file Markdown duy nhất**, đầy đủ và hợp nhất kết quả từ các agent.  
// - Với yêu cầu quản lý ghi chú:  
//   → Trả về **kết quả thao tác hoặc nội dung ghi chú** (nếu có), dưới dạng Markdown.

// ---

// **Mục tiêu:** trở thành một “AI điều phối viên” thông minh, biết chọn đúng công cụ cho đúng việc, và trả về kết quả nhất quán, chuẩn định dạng.
import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";
import { standardizeTemplateAgent, templateAgent, templateAnalyzeAgent } from "../agents/ecomerce-agent";
import { getTemplateFromDB, saveTemplateToDB } from "../rag/save-and-retrieve";
import { mastra } from "..";


const standardizeStep = createStep({
  id: "standardize-template-markdown",
  description: "Chuẩn hóa template Markdown được lấy từ database",
  inputSchema: z.object({
    input: z.string()
  }),
  outputSchema: z.object({
    input : z.string(),
    template: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
 
  execute: async ({ inputData }) => {

    //Map input field of inputData into input variable
    let { input } = inputData;
    input = "Phân tích yêu cầu chức năng: " + input.trim();
    const availableTemplates = await getTemplateFromDB("Format phân tích yêu cầu chức năng của website e-commerce.");
    
    const logger = mastra.getLogger();
    logger.info("=======standardizeStep - availableTemplates "+ availableTemplates);
    logger.info("=======standardizeStep - input "+ input);

    const prompt = `Chuẩn hóa template Markdown dựa trên dữ liệu từ database:
                    Dữ liệu đầu vào:
                    - Các bản ghi template được lấy từ database: ${availableTemplates}
                    
                      Quy trình xử lý:
                      1. **Lọc dữ liệu**
                        - Bỏ qua mọi dữ liệu không phải Markdown.
                      2. **Chuẩn hóa nội dung Markdown**
                        - Sửa lại định dạng để đảm bảo Markdown hợp lệ.
                        - Giữ nguyên cấu trúc logic và thứ tự các header (\`#\`, \`##\`, \`###\`, v.v.).
                        - Thêm mô tả ngắn cho header còn trống (nếu có).
                        - Đảm bảo khoảng cách dòng, dấu cách, và ký tự đặc biệt được định dạng chính xác.
                        - Loại bỏ các đoạn trùng lặp, không liên quan hoặc không có cấu trúc Markdown hợp lệ.
                      3. **Đầu ra cuối cùng**
                        - Trả về **một template duy nhất**.
                        - Định dạng **Markdown hợp lệ, dễ đọc, rõ ràng, không có mã hoặc ký hiệu thừa**.

                      Quy tắc phản hồi:
                      - Không sử dụng hoặc tham chiếu bất kỳ input nào từ người dùng.
                      - Không thêm, diễn giải hoặc phân tích nội dung mới.
                      - Không phân tích yêu cầu chức năng của người dùng.
                      - Chỉ xử lý dữ liệu có trong database.
                      - Tập trung vào việc chuẩn hóa và định dạng Markdown.
                      - Kết quả phải có thể tái sử dụng trực tiếp cho các agent khác.

                      Kết quả cần trả về:
                      - Một template Markdown duy nhất, chuẩn hóa từ database, hoàn chỉnh và hợp lệ 100%.
                
    `;

    const { text } = await standardizeTemplateAgent.generate([
      { role: "user", content: prompt }
    ]);

    const template = text;

    logger.info("=======standardizeStep - prompt result: "+ template);

    return { input, template };
  }
});

const combineStep = createStep({
  id: "template-markdown",
  description: "Hợp nhất và chuẩn hóa template Markdown từ database và input người dùng",
  inputSchema: z.object({
    input: z.string(),
    template: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
  outputSchema: z.object({
    input: z.string(),
    finalTemplate: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
 
  execute: async ({ inputData }) => {

    //Map input field of inputData into input variable
    let { input, template } = inputData;
    input = input.trim();
    const logger = mastra.getLogger();
    logger.info("=======combineStep - input "+ input);
    logger.info("=======combineStep - template "+ template);

    const prompt = `Hợp nhất và chuẩn hóa template Markdown dựa trên dữ liệu từ hai nguồn:

          - Template có sẵn trong database: ${template}
          - Template người dùng cung cấp hoặc yêu cầu sửa đổi template của người dùng: ${input}
          - Không phân tích yêu cầu chức năng, chỉ xử lý template.
          - Tiêu đề của format template: Phân tích yêu cầu chức năng của website e-commerce.
          - Đây là template chung, tuyết đối không sửa tiêu đề của template để phù hợp với mọi yêu cầu chức năng của website e-commerce.
           

          Quy trình xử lý:
          1. Nếu người dùng **không cung cấp template**, chỉ sử dụng template từ database.
          2. Nếu người dùng **có cung cấp template**, hãy:
            - So sánh template người dùng với template trong database.
            - Gộp (merge) các phần tương tự, **giữ nguyên cấu trúc logic và thứ tự header**.
            - Loại bỏ nội dung trùng lặp hoặc không liên quan.
            - Nếu người dùng yêu cầu, loại bỏ các phần không cần thiết.
            - Cập nhật template theo yêu cầu của người dùng.
            - Thêm mô tả ngắn cho các header chưa có mô tả.
          3. Chuẩn hóa kết quả cuối cùng thành **một bản Markdown hoàn chỉnh, hợp lệ 100%**.
          4. Cập nhập, thay đổi hoặc XÓA nội dung ${template} dựa trên yêu cầu sửa đổi ${input} của người dùng để lưu trữ phiên bản mới vào database.
          Quy tắc phản hồi:
          - Không thêm, suy diễn, hoặc phân tích nội dung ngoài phạm vi template.
          - Chỉ xử lý và hợp nhất template Markdown.
          - Đảm bảo kết quả dễ đọc, đúng định dạng và có thể tái sử dụng cho các agent khác.

          Kết quả cần trả về:
          Một template duy nhất, định dạng Markdown hợp lệ, đã được hợp nhất và chuẩn hóa.
                
    `;

    const { text } = await templateAgent.generate([
      { role: "user", content: prompt }
    ]);

    logger.info("=======combineStep - prompt result: "+ text);

    
    const finalTemplate = text;
    return {input, finalTemplate };
  }
});


const templateAnalyzeStep = createStep({
  id: "template-markdown",
  description: "Phân tích chức năng website e-commerce dựa trên template và trả về file markdown",
  retries: 3,
  inputSchema: z.object({
    input: z.string(),
    finalTemplate: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
  outputSchema: z.object({
    text: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
 
  execute: async ({ inputData }) => {

    //Map input field of inputData into input variable
    const { input, finalTemplate } = inputData;
    const logger = mastra.getLogger();
    logger.info("=======templateAnalyzeStep - input "+ input);
    logger.info("=======templateAnalyzeStep - finalTemplate "+ finalTemplate);
    await saveTemplateToDB(finalTemplate);
    const prompt = `Phân tích yêu cầu chức năng: ${input} dựa trên template người dùng cung cấp và trả về file markdown hoàn chỉnh với đầy đủ các đầu mục giống với template.
    Dữ liệu đầu vào: 
          - Template cần tuân theo khi phản hồi lại cho người dùng: ${finalTemplate}
          - Yêu cầu phân tích của người dùng: ${input}
          - Sử dụng ${finalTemplate} như một khuôn mẫu bắt buộc để phân tích yêu cầu chức năng.
    
    Quy tắc phản hồi:
      - Phân tích yêu cầu chức năng dựa trên template người dùng cung cấp. 
      - Vẽ diagram bằng Mermaid nếu có phần yêu cầu sơ đồ, luồng sử lý nghiệp vụ,v.v.
      - Luôn trả kết quả sau khi phân tích về định dạng file Markdown hoàn chỉnh.
      - Không thêm, bớt, chỉnh sửa hay giải thích bất kỳ nội dung nào.
      - Nếu có phần không ở định dạng Markdown → tự động chuyển sang Markdown.
      - Giữ nguyên định dạng gốc (đặc biệt là phần UI/UX).
      - Đảm bảo kết quả cuối cùng là Markdown hợp lệ và hoàn chỉnh 100%.
      - Đảm bảo dữ liệu trả về đúng định dạng markdown bản thô (có các ký tự #, ##, v.v).
      - Tuyệt đối không hiển thị markdown dưới dạng đã được render.

    `;

    const { text } = await templateAnalyzeAgent.generate([
      { role: "user", content: prompt }
    ]);
    logger.info("=======templateAnalyzeStep - prompt result: "+ text);
    return { text };
  }
});



const getTemplateWorkflow = createWorkflow({
  id: 'get-template-workflow',
  inputSchema: z.object({
    input: z.string().describe('Template người dùng cung cấp (nếu có) để phân tích chức năng website e-commerce'),
  }),
  outputSchema: z.object({
    text: z.string().refine(
        (content) => content.trim().startsWith("#") && content.includes("##"),
        { message: "Output must be valid Markdown with headers" }
      )
  }),
})
  .then(standardizeStep)
  .then(combineStep)
  .then(templateAnalyzeStep);

getTemplateWorkflow.commit();

export { getTemplateWorkflow };
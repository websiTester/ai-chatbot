"use server";
import { mastra } from "@/mastra";
import { getObsidianAgent } from "@/mastra/agents/obsidian-agent";
import { AddUpdateResponseToDB } from "@/mastra/db/response-service";

export async function getObsidianResponse(formData: FormData) {
    const input = formData.get("request") as string;
    //const agent = mastra.getAgent("obsidianAgent");
    const agent = await getObsidianAgent();
    const result = await agent.generate(input, {
        memory: {
            thread: "user-session", // Use actual user/session ID
            resource: "obsidian-chat",
        },
    });
    return result.text;
}

export async function getObsidianResponse2(input: string) {
    //const agent = mastra.getAgent("obsidianAgent");
    const agent = await getObsidianAgent();
    const prompt = `
        Thực hiện yêu cầu sau của người dùng: ${input}.
        Trong trường hợp người dùng yêu cầu update, xóa nội dung trong note: thực hiện theo instruction.
        Bạn đã được phép override note nếu note đã tồn tại, tự động set tham số overwriteIfExists = true khi sử dụng tool.
        
        Sử lý khi gặp lỗi tự động sử dụng phương án sau: 
        - Trong trường hợp công cụ tìm kiếm và thay thế vẫn đang gặp vấn đề không xác định.
        - Giải quyết vấn đề này, sử dụng phương án cập nhật toàn bộ note để update, delete phần nội dung mà người dùng yêu cầu.
    `;
    const result = await agent.generate(input, {
        memory: {
            thread: "user-session", // Use actual user/session ID
            resource: "obsidian-chat",
        },
    });
    return result.text;
}

export async function saveTextInObsidian(messageToSave: string) {

    const prompt = `
    Tạo note mới có Title là Analyze Result có định dạng markdown vào folder /1 - Rough Note/E-commerce Analyze Result trong obsidian, đảm bảo note mới là file markdown có đuôi .md.
    Sau khi note được tạo, ghi đè nội dung bên trong note là:
    ${messageToSave}.
    Trong trường hợp folder chưa được khởi tạo, tự động tạo folder tương ứng để lưu trữ note.
    Tự động chuyển nội dung sang định dạng markdown nếu cần thiết.
    `;

    //const agent = mastra.getAgent("obsidianAgent");
    const agent = await getObsidianAgent();
    const result = await agent.generate(prompt, {
        memory: {
            thread: "user-session", // Use actual user/session ID
            resource: "obsidian-chat",
        },
    });
    return result.text;
}

export async function AddUpdateResponse(responseData: any){
    await AddUpdateResponseToDB(responseData);
}
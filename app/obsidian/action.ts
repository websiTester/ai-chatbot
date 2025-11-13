"use server";
import { mastra } from "@/mastra";
import { obsidianAgent } from "@/mastra/agents/obsidian-agent";
import { AddUpdateResponseToDB } from "@/mastra/db/response-service";

export async function getObsidianResponse(formData: FormData) {
    const input = formData.get("request") as string;
    const agent = mastra.getAgent("obsidianAgent");
    const result = await agent.generate(input, {
        memory: {
            thread: "user-session", // Use actual user/session ID
            resource: "obsidian-chat",
        },
    });
    return result.text;
}

export async function getObsidianResponse2(input: string) {
    const agent = mastra.getAgent("obsidianAgent");
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
    Thêm note mới vào folder /1 - Rough Note/E-commerce analyze result trong obsidian, nội dung note là:
    ${messageToSave}
    `;

    const agent = mastra.getAgent("obsidianAgent");
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
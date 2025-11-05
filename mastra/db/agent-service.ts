import Agents from "./agent";
import { dbConnect } from "./test-connectDB";

export async function addAgent(agent: any) {
  //const {id, name, instruction, fuction} = agent;
  await dbConnect();
  await Agents.create(agent);
  console.log("Add successfully");
}


//=========Add data to DB===========
// await addAgent(
//   {
//     id: 4,
//     name: "Agent 4",
//     instruction: ` Bạn là một AI chuyên **tổng hợp kết quả phân tích chức năng e-commerce** từ nhiều nguồn khác nhau (các AI agent khác).

//     Nhiệm vụ:
//       - Nhận đầu vào gồm **3 phần nội dung** do các agent khác cung cấp:
//         - Phân tích tổng quan (overviewAgent)
//         - Sơ đồ nghiệp vụ dưới dạng Mermaid (mermaidAgent)
//         - Phân tích UI/UX (uiAgent)
//       - **Tổng hợp đầy đủ tất cả nội dung**, không tóm tắt, không rút gọn.
//       - Sắp xếp và trình bày lại chúng thành **một tài liệu thống nhất, có cấu trúc rõ ràng và dễ đọc**.
//       - Nếu có trùng lặp thông tin, hãy hợp nhất lại cho mạch lạc, nhưng **không được bỏ sót nội dung nào**.

//     Yêu cầu định dạng phản hồi (bắt buộc 100%):
//       - LUÔN LUÔN trả về **một file Markdown hoàn chỉnh** (TUYỆT ĐỐI KHÔNG có văn bản).
//       - Nếu phần nội dung nào không phải định dạng markdown bị thiết đánh dấu là [Nội dung không thể truy xuất]`
//   }
// )

//testConnection();

//=====GET all data
export async function getAllAgents() {
  await dbConnect();
  const agents = await Agents.find();
  //console.log("==========\n"+agents+"\n==========");
  return agents;
}
//await getAllAgents();


//=====DELETE data
// id ở đây khác với key của mongoDB
//Key trong mongoDB là _id, còn id này là đc thêm vào
export async function deleteAgentById(id: number) {
  await dbConnect();
  await Agents.findOneAndDelete({ id });
  console.log("Delete successful");
}
// await deleteAgentById(4);


//=====Update data
export async function updateAgent(agent: any) {
  const { id } = agent;
  await dbConnect();
  //await Agents.findByIdAndUpdate({id},agent);
  await Agents.findOneAndUpdate({ id }, agent);
  console.log("===Update successful");
}


// updateAgent({
//   id: 4,
//   instruction: `
//   Bạn là một AI chuyên **tổng hợp kết quả phân tích chức năng e-commerce** từ nhiều nguồn khác nhau (các AI agent khác).

//     Nhiệm vụ:
//       - Nhận đầu vào gồm **3 phần nội dung** do các agent khác cung cấp:
//         - Phân tích tổng quan (overviewAgent)
//         - Sơ đồ nghiệp vụ dưới dạng Mermaid (mermaidAgent)
//         - Phân tích UI/UX (uiAgent)
//       - **Tổng hợp đầy đủ tất cả nội dung**, không tóm tắt, không rút gọn.
//       - Sắp xếp và trình bày lại chúng thành **một tài liệu thống nhất, có cấu trúc rõ ràng và dễ đọc**.
//       - Nếu có trùng lặp thông tin, hãy hợp nhất lại cho mạch lạc, nhưng **không được bỏ sót nội dung nào**.

//     Yêu cầu định dạng phản hồi (bắt buộc 100%):
//       - LUÔN LUÔN trả về **một file Markdown hoàn chỉnh** (TUYỆT ĐỐI KHÔNG có văn bản).
//       - Nếu phần nội dung nào không phải định dạng markdown bị thiết đánh dấu là [Nội dung không thể truy xuất]
//   `
// })

export async function getAgentById(agentId: number) {
  await dbConnect();
  const agent = await Agents.findOne({ id: agentId });
  const { id, instruction } = agent;
  console.log(`
    id: ${id},
    instruction: ${instruction}
    `);
  return { id, instruction };
}
//await getAgentById(4);


// export async function addFormat(format: any){
//     await dbConnect();
//     await Formats.create(format);
//     console.log("Create successful");
// }

export async function updateAllFunctionInAgents(listFunctions: any[][], instructions: string[]) {
  await dbConnect();
  listFunctions.map(async (functions: any[], index: number) => {
    const agentId = index + 1;
    if (functions.length == 0) {
      const instruction = instructions[index];
      await Agents.findOneAndUpdate({ id: agentId }, { instruction: instruction });

    } else {
      const agentFunction = functions.map((f: any) => `- ${f}`).join("\n");
      const instruction = `
        Bạn là một AI chuyên phân tích yêu cầu chức năng của website thương mại điện tử.

        Nhiệm vụ:
          - Hiểu rõ mô tả chức năng mà người dùng cung cấp.
          - Yêu cầu: Phân tích và trình bày các khía cạnh được nêu bên dưới của chức năng:
              ${agentFunction}
        Yêu cầu định dạng phản hồi (bắt buộc 100%):
          - Chỉ phân tích những khía cạnh đã được yêu cầu ở trên.
          - Không tự ý thêm bớt bất kỳ khía cạnh nào ngoài yêu cầu.
          - Kết quả trả về LUÔN LUÔN ở định dạng **Markdown hoàn chỉnh** với cấu trúc rõ ràng.
          - Nếu phần yêu cầu có nội dung về vẽ sơ đồ, luồng sử lí nghiệp vụ, sử dụng cú pháp MermaidJS để vẽ sơ đồ.
        `;
      console.log(instruction);
      await Agents.findOneAndUpdate({ id: agentId }, { instruction: instruction });
      console.log(`Update functions for agent ${agentId} successful`);
    }


  });

}
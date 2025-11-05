"use server";
 
import { addFormat, deleteFormatById, getAllFormat, getFormatByName, updateFormatDB } from "@/mastra/db/format-service";
import { mastra } from "../../mastra";
import { updateAllFunctionInAgents } from "@/mastra/db/agent-service";
 
export async function getWeatherInfo(formData: FormData) {
  const city = formData.get("city")?.toString();
  const agent = mastra.getAgent("weatherAgent");
 
  const result = await agent.generate(`What's the weather like in ${city}?`);
  

  return result.text;
}

export async function getAnalysisMarkdown(formData: FormData) {
  const functionName = formData.get("functionName")?.toString();
  //const agent = mastra.getAgent("finalAgent");
  const agent = mastra.getAgent("finalShortAgent");
  const result = await agent.generate(`Phân tích chức năng của 1 website e-commerce: ${functionName}`);
  return result.text;
}

export async function getAiResponse(input: string) {
  const functionName = input;
  //const agent = mastra.getAgent("finalAgent");
  const agent = mastra.getAgent("finalShortAgent");
  
  const result = await agent.generate(`Phân tích chức năng của 1 website e-commerce: ${functionName}`);
  return result.text;
}

export async function getStreamingMarkdown(formData: FormData) {
  const functionName = formData.get("functionName")?.toString();
  const agent = mastra.getAgent("streamingAgent");

  const result = await agent.generate(`Phân tích chức năng của 1 website e-commerce: ${functionName}`);
  return result.text;
}

export async function createFormat(format: any){
  await addFormat(format);

}

export async function updateFormat(format: any){
  await updateFormatDB(format);

}

export async function updateAgentsInstruction(listInstructions: any[][], instructions: string[]){
  await updateAllFunctionInAgents(listInstructions,instructions);
  //console.log("listInstructions:", listInstructions);
  //console.log("instructions:", instructions);
}

export async function fetchFormats(){
  console.log("fetchFormats run");
  const formats = await getAllFormat();
  console.log("fetchFormats run successful");
  return formats;
}

export async function fetchFormatByName(name: any){
  const format = await getFormatByName(name);
  return format;
}

export async function deleteFormat(formatId: string){
  await deleteFormatById(formatId);

}
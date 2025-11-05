import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { MDocument, rerank, rerankWithScorer } from "@mastra/rag";
import { MongoDBVector } from '@mastra/mongodb'


// 1. Initialize document
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const formatTemplate = `
# Format phân tích yêu cầu chức năng

Khi người dùng hỏi về một yêu cầu chức năng của website, bạn **phải trả lời đúng theo cấu trúc sau**:

1. **Mô tả tổng quan**: Tóm tắt ngắn gọn về chức năng.
2. **Tác nhân (Actors)**: Liệt kê các tác nhân tương tác với chức năng này.
3. **Tiền điều kiện (Preconditions)**: Những điều kiện cần có trước khi chức năng hoạt động.
4. **Luồng xử lý chính (Main Flow)**: Mô tả từng bước chính mà người dùng hoặc hệ thống thực hiện.
5. **Dữ liệu liên quan**: Các loại dữ liệu cần thiết hoặc sinh ra trong quá trình hoạt động.
`;


const doc = MDocument.fromMarkdown(formatTemplate);


// 2. Create chunks
const chunks = await doc.chunk({
  strategy: "markdown",
  maxSize: 1024,
  overlap: 0,
});
 

const { embeddings } = await embedMany({
  model: google.textEmbedding("text-embedding-004") as any,
  values: chunks.map((chunk) => chunk.text),
});

const store = new MongoDBVector({
  uri: process.env.MONGODB_URI ?? '',
  dbName: process.env.MONGODB_DATABASE ?? '',
})

//Kiểm tra và tạo index nếu chưa tồn tại
// try {
//   await store.createIndex({
//     indexName: "myCollection2",
//     dimension: 768,
//   });
//   console.log("Index 'myCollection2' created successfully");
// } catch (error: any) {
//   if (error.message?.includes('already exists') || error.code === 13297) {
//     console.log("Database/Collection already exists, connecting to existing one");
//   } else {
//     console.error("Error creating index:", error.message);
//     throw error;
//   }
// }

// await store.upsert({
//   indexName: "myCollection2",
//   vectors: embeddings,
//   metadata: chunks.map((chunk) => ({
//     text: chunk.text,
//     createdAt: new Date().toISOString()
//   })),
// });



  // const { embedding } = await embed({
  //   value: "Phân tích yêu cầu chức năng của website?",
  //   model: google.textEmbedding("text-embedding-004") as any,
  // });

  // const results = await store.query({
  //   indexName: "myCollection2",
  //   queryVector: embedding,
  //   topK: 1, //top 10 closest vectors
  // });

export async function getTemplateFromDB(prompt: string) {
    const { embedding } = await embed({
      value: prompt,
      model: google.textEmbedding("text-embedding-004") as any,
    });

    const results = await store.query({
      indexName: "myCollection2",
      queryVector: embedding,
      topK: 100, //top 10 closest vectors
    });

    // let finalResult = "";
    // for (const result of results) {
    //   //console.log(result.metadata);
    //   finalResult += JSON.stringify(result.metadata) + "\n\n";
    //   //finalResult += result.metadata?.text + "\n\n";
    // }

    let newestResult = results.reduce((latest, current) => {
      const latestTime = new Date(latest.metadata?.createdAt).getTime();
      const currentTime = new Date(current.metadata?.createdAt).getTime();
      return currentTime > latestTime ? current : latest;
    });

    // Chỉ lưu metadata (hoặc text) của result mới nhất
    let finalResult = JSON.stringify(newestResult.metadata, null, 2);
    console.log("Retrieved template from DB:", finalResult);

    return finalResult;
}


export async function saveTemplateToDB(template: string) {
  console.log("=======Saving template to DB:", template);
    const doc2 = MDocument.fromMarkdown(template);
    const chunks = await doc2.chunk({
      strategy: "markdown",
      maxSize: 4000,
      overlap: 0,
    });

    const { embeddings } = await embedMany({
      model: google.textEmbedding("text-embedding-004") as any,
      values: chunks.map((chunk) => chunk.text),
    });

    await store.upsert({
      indexName: "myCollection2",
      vectors: embeddings,
      metadata: chunks.map((chunk) => ({
        text: chunk.text,
        createdAt: new Date().toISOString()
      })),
    });
}
 
// Display results
//console.log(results);

//getTemplateFromDB("Format phân tích yêu cầu chức năng của website e-commerce?");
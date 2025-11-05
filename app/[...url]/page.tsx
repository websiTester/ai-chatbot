import { config } from "process";
import { ragChat } from "../lib/rag-chat";
import { redis } from "../lib/redis";
import { ChatWrapper } from "../components/ChatWrapper";

interface PageProps{
    params: {
        url : string | string[] | undefined
    }
}

function reconstructUrl(urlParts: string[]) {
    const decodedComponents = urlParts.map(part => decodeURIComponent(part));
    return decodedComponents.join('/');
}

const Page = async ({ params }: PageProps) => {
    //const reconstructedUrl = reconstructUrl(params.url as string[]);
    //console.log("URL params: "+params.toString());

    const sessionId = "mock-session";
    const reconstructedUrl = "https://en.wikipedia.org/wiki/Tom_Harley";
    //https://en.wikipedia.org/wiki/Tom_Harley
    //Check if URL is already indexed in the database
    //Url will be stored in a Redis Set named "indexed_urls"
    const isAlreaddyIndexed = await redis.sismember("indexed_urls", reconstructedUrl);
    
    //Load all data from the URL into RAG context and save to database 
    //if the url is not already indexed
    //Database: Upstash Redis
    if(!isAlreaddyIndexed){
        await ragChat.context.add({
                type: "html",
                source: reconstructedUrl,
                config: {
                    chunkOverlap: 50,
                    chunkSize: 200
                }
            })
        redis.sadd("indexed_urls", reconstructedUrl);
    }

    return <ChatWrapper sessionId={sessionId} />;
}

export default Page
import ReponsesAgent from "./response";
import { dbConnect } from "./test-connectDB";

export async function AddUpdateResponseToDB(responseData: any){
    await dbConnect();
    const response = await ReponsesAgent.findOne({ responseId: responseData.responseId });
    if(response){
        await ReponsesAgent.updateOne({ responseId: responseData.responseId }, responseData);
    } else {
        await ReponsesAgent.create(responseData);
    }
}
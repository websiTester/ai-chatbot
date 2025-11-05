import { Schema } from "mongoose"
import mongoose from 'mongoose';


// export type Agent = {
//     id: number,
//     name: string,
//     instruction: string,
//     function: string
// }

const agentSchema = new Schema(
    {
        id: Number,
        name: String,
        instruction: String
    },
    {
        timestamps: true
    }
)

const Agents =  mongoose.models.Agents 
|| mongoose.model("Agents", agentSchema);



export default Agents;


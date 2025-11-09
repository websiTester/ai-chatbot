import { Schema } from "mongoose";
import mongoose from 'mongoose';

const responseAgentSchema = new Schema(
    {
        responseId: Number,
        response: String,
        isAlternate: Boolean
    },
    {
        timestamps: true
    }
)
const ReponsesAgent =  mongoose.models.ReponsesAgent 
|| mongoose.model("ReponsesAgent", responseAgentSchema);
export default ReponsesAgent;
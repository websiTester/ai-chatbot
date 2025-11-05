import mongoose, { Schema } from 'mongoose';

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
const DefaultAgents =  mongoose.models.DefaultAgents 
|| mongoose.model("DefaultAgents", agentSchema);
export default DefaultAgents;
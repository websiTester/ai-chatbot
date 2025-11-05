import { Schema } from "mongoose"
import mongoose from 'mongoose';


const PairSchema = new Schema({
  header: { type: String},
  content: { type: String },
});

const FormatSchema = new Schema({
  formatName: { type: String },
  pair: [PairSchema], 
},{
        timestamps: true
    });

const Formats =  mongoose.models.Formats 
|| mongoose.model("Formats", FormatSchema);

export default Formats;

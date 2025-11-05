import { dbConnect } from "./test-connectDB";
import Formats from "./format";

export async function addFormat(format: any){
    await dbConnect();
    await Formats.create(format);
    console.log("Create successful");
}

export async function updateFormatDB(format: any){
    const {formatName} = format;
    await dbConnect();
    await Formats.findOneAndUpdate({formatName},format);
    console.log("Update successful");
}


export async function getAllFormat(){
    console.log("getAllFormat run");
    await dbConnect();
    console.log("getAllFormat - ConnectedDB - run");
    const allFormats = await Formats.find();
    console.log("getAllFormat - Get Successful - run: ");
    return allFormats;
}


export async function getFormatByName(name: string){
    await dbConnect();
    const format = await Formats.findOne({formatName:name});
    return format;
}

export async function deleteFormatById(formatId: string){
    await dbConnect();
    await Formats.findByIdAndDelete(formatId);
    console.log("Delete format successful");
}
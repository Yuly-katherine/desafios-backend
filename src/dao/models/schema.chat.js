import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userName:{
        type:String,
        default: "Undefined",
    },
    message:{
        type:String,
        required:true
    }
})

const chatModel = mongoose.model("chat", chatSchema);
export default chatModel;
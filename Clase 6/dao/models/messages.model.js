import mongoose from "mongoose";

const messagesCollection="products"
const messagesSchema = new mongoose.Schema({
    email:{type: String,
            required: true},
    message:String,
})

export const userModel = mongoose.model(messagesCollection,messagesSchema)
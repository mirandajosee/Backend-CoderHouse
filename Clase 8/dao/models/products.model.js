import mongoose from "mongoose";

const prodCollection="products"
const prodSchema = new mongoose.Schema({
    title:{type: String,
           unique:true,
           require:true},
    description:String,
    code:{type: String,
           unique: true},
    stock: Number,
    price: Number,
    status: {
        type: Boolean,
        default: true},
    thumbnail: String
})

export const productsModel = mongoose.model(prodCollection,prodSchema)
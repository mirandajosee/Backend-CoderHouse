import mongoose from "mongoose";

const prodCollection="products"
const prodSchema = new mongoose.Schema({
    title:String,
    description:String,
    code:{type: String,
           unique: True},
    stock: Number,
    price: Number,
    status: {
        type: Boolean,
        default: true},
    thumbnail: String
})

export const productsModel = mongoose.model(prodCollection,prodSchema)
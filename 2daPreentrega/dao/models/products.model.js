import mongoose from "mongoose";

const prodCollection="products"
const prodSchema = new mongoose.Schema({
    title:{type: String,
           unique:true,
           require:true},
    description:{type: String,
            require:true},
    code:{type: String,
           unique: true},
    stock: {type: Number,
            require:true},
    price: {type: Number,
            require:true},
    status: {
        type: Boolean,
        default: true},
    thumbnail: String
})

export const productsModel = mongoose.model(prodCollection,prodSchema)
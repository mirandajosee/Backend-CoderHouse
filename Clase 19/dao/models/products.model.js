import mongoose from "mongoose";
import { createRequire } from 'node:module'
const mongoosePaginate = createRequire(import.meta.url)("mongoose-paginate-v2")

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
    thumbnail: String,
    owner: {type: String,
        default:"admin",
        require:true}
})

prodSchema.plugin(mongoosePaginate)


export const productsModel = mongoose.model(prodCollection,prodSchema)
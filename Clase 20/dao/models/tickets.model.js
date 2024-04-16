import mongoose from "mongoose";
import { createHash } from "../../utils.js";

const ticketsCollection="tickets"
const ticketsSchema = new mongoose.Schema({
    amount: Number,
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number,
            _id:false
        }]
    },
    purchaser:{
        type:String,
        require:true,
    },
    code:{
        type: String,
        default: function() {
          return createHash(this.purchase_datetime+this._id)
        }
    }
},{timestamps: { createdAt: 'purchase_datetime', updatedAt: 'updated_datetime' }})

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema)
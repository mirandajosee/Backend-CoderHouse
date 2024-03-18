import mongoose from "mongoose";
import { createHash } from "../../utils";

const ticketsCollection="tickets"
const ticketsSchema = new mongoose.Schema({
    timestamps: { purchase_datetime: 'created_at', updated_datetime: 'updated_at' },
    amount: Number,
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
})

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema)
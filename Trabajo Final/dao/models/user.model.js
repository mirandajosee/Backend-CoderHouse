import mongoose from "mongoose";

const usersCollection="users"
const usersSchema = new mongoose.Schema({
    email:{type: String,
        unique:true,
        require:true},
    password:{type:String,
    require:true},
    firstName:String,
    lastName:String,
    role:{type:String,
        enum:["user","admin","premium"],
        default:"user",
    },
    documents:{
        type:[{
            name:String,
            reference:String,
            _id:false}
        ]
    },
    last_connection:Date,
    age:Number,
    cartID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    }
})

export const usersModel = mongoose.model(usersCollection, usersSchema)
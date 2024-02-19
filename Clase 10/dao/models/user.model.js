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
        default:"user",
    }
})

export const usersModel = mongoose.model(usersCollection, usersSchema)
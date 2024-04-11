import { usersModel } from "../models/user.model.js";
import { CustomError } from "../../errors/CustomError.js";
import { logger } from "../../logger/logger.js";

export default class UserDaoMongo{    
    constructor(){
        this.User = usersModel
    }

    async get(){
        try {
            return await this.User.find({})
            
        } catch (error) {
            return  logger.error(error)
        }
    }

    async getByMail(email){
        try {
            return await this.User.findOne({email:email}).lean()
            
        } catch (error) {
            return  logger.error(error)
        }
    }

    async getById(uid){
        try {
            return await this.User.findOne({_id:uid}).lean()
            
        } catch (error) {
            return  logger.error(error)
        }
    }

    async updateUser(uid, updateUser){
        try    {
            const result=await this.User.findByIdAndUpdate({_id: uid}, updateUser, {new: true}).lean()
            if (!result){
                CustomError.createError({
                    name:"User not found",
                    code:3,
                    cause:"The user does not exist in the current database",
                    message:`El usuario ${uid} no existe o no se encuentra en la base de datos actual`
                })
            }
            return result}
        catch(err){logger.error(err)}
    }


}
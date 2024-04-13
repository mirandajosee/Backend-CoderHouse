import { productsModel } from "../models/products.model.js"
import { CustomError } from "../../errors/CustomError.js"
import { logger } from "../../logger/logger.js"


export default class ProductDaoMongo {
    constructor(){
        this.product = productsModel        
    }

    async getPageProducts({limit=10, pageQuery=1, sort="default"}){     
        try{  
        const order={"asc":1,"desc":-1}
        const result =sort=="default"? 
            await this.product.paginate({status:true}, {limit, page: pageQuery, lean: true}):
            await this.product.paginate({status:true}, {limit, page: pageQuery, sort: {price: order[sort]}, lean: true})
        if (!limit || !sort || !pageQuery ){
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were missing or had a wrong type",
                code:"2",
                message:`Dato faltante o de tipo incorrecto\n Se recibió limit=${limit},sort=${sort},pageQuery=${pageQuery}`
            })
        }
        result.status="success"
        result.payload=result.docs
        return await result}
        catch(err) {logger.error(err)}                          
    }
    async getProducts(config){       
        try {
        return await this.product.find({status:true}).lean()}
        catch(err){logger.error(err)}
        
    }
    async getProductById(pid){
        try{
            const result=await this.product.findById(pid).lean()
            if (!result){
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product does not exist in the current database",
                    message:`El producto ${pid} no existe o no se encuentra en la base de datos actual`
                })
            }
            return result }   
        catch(err) {logger.error(err)}
    }


    async addProduct(newProduct){       
        try {
        return await this.product.create(newProduct)}
        catch(err){logger.error(err)}
        
    }

    async updateProduct(pid, updateProduct){
        try    {
            const result=await this.product.findByIdAndUpdate({_id: pid}, updateProduct, {new: true}).lean()
            if (!result){
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product does not exist in the current database",
                    message:`El producto ${pid} no existe o no se encuentra en la base de datos actual`
                })
            }
            return result}
        catch(err){logger.error(err)}
    }

    async deleteProduct(pid){       
        try{
            const result=await this.product.findByIdAndUpdate(pid, { status: false }, {new: true}).lean()
            if (!result){
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product does not exist in the current database",
                    message:`El producto ${pid} no existe o no se encuentra en la base de datos actual`
                })
            }
            return result  }
        catch(err){logger.error(err)}    
    }

}
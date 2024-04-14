import { logger } from "../logger/logger.js"

export default class ProductRepositories { // UserServices
    constructor(dao){
        this.dao = dao
    }

    async getPageProducts(objConfig){     
        try{  
            objConfig.limit = objConfig.limit &&  parseInt(objConfig.limit)
            objConfig.page  = objConfig.page  && parseInt(objConfig.page)
            return await this.dao.getPageProducts(objConfig)}
        catch(err) {logger.error(err)}                          
    }

    async getProductById(pid){
        try{
        return await   this.dao.getProductById(pid)}
        catch(err) {logger.error(err)}
    }
    async getProducts(config){
        try{
        return await   this.dao.getProducts(config)}
        catch(err) {logger.error(err)}
    }

    async addProduct(newProduct){       
        try {
        return await this.dao.addProduct(newProduct)
    }catch(err){logger.error(err)}
}

    async updateProduct(pid, updateProduct){
        try    {
        return await this.dao.updateProduct(pid, updateProduct)}
        catch(err){logger.error(err)}
    }

    async deleteProduct(pid){       
        try{
        return await   this.dao.deleteProduct(pid)
    }catch(err){logger.error(err)} }
}
export default class ProductRepositories { // UserServices
    constructor(dao){
        this.dao = dao
    }

    async getPageProducts(objConfig){     
        try{  
            objConfig.limit = objConfig.limit &&  parseInt(objConfig.limit)
            objConfig.page  = objConfig.page  && parseInt(objConfig.page)
            objConfig.sort  = objConfig.sort  && parseInt(objConfig.sort)
            return await this.dao.getProducts(objConfig)}
        catch(err) {console.log(err)}                          
    }

    async getProductById(pid){
        try{
        return await   this.dao.getProductById(pid)}
        catch(err) {console.log(err)}
    }
    async getProducts(config){
        try{
        return await   this.dao.getProducts(config)}
        catch(err) {console.log(err)}
    }

    async addProduct(newProduct){       
        try {
        return await this.dao.addProduct(newProduct)
    }catch(err){console.log(err)}
}

    async updateProduct(pid, updateProduct){
        try    {
        return await this.dao.updateProduct(pid, updateProduct)}
        catch(err){console.log(err)}
    }

    async deleteProduct(pid){       
        try{
        return await   this.dao.deleteProduct(pid)
    }catch(err){console.log(err)} }
}
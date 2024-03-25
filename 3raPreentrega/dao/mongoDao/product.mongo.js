import { productsModel } from "../models/products.model"



export default class ProductDaosMongo {
    constructor(){
        this.product = productsModel        
    }

    async getProducts({limit=10, pageQuery=1, sort="default"}){     
        try{  
        const result =sort=="default"? 
            await this.product.paginate({}, {limit, page: pageQuery, lean: true}):
            await this.product.paginate({}, {limit, page: pageQuery, sort: {price: order[sort]}, lean: true})
        result.status="success"
        result.payload=result.docs
        return await result}
        catch(err) {console.log(err)}                          
    }

    async getProductById(pid){
        try{
        return await this.product.findById(pid).lean() }   
        catch(err) {console.log(err)}
    }


    async addProduct(newProduct){       
        try {
        return await this.product.create(newProduct).lean()}
        catch(err){console.log(err)}
        
    }

    async updateProduct(pid, updateProduct){
        try    {
        return await this.product.findByIdAndUpdate({_id: pid}, updateProduct, {new: true}).lean()}
        catch(err){console.log(err)}
    }

    async deleteProduct(pid){       
        try{
        return await this.product.findByIdAndUpdate({ _id: pid }, { isActive: false }, {new: true}).lean()  }
        catch(err){console.log(err)}    
    }

}
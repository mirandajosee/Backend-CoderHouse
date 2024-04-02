import { productsModel } from "../models/products.model.js"



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
        result.status="success"
        result.payload=result.docs
        return await result}
        catch(err) {console.log(err)}                          
    }
    async getProducts(config){       
        try {
        return await this.product.find({status:true}).lean()}
        catch(err){console.log(err)}
        
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
        return await this.product.findByIdAndUpdate({ _id: pid,status:true }, { status: false }, {new: true}).lean()  }
        catch(err){console.log(err)}    
    }

}
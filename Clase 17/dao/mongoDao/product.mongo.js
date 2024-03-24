import { productsModel } from "../models/products.model"



export default class ProductDaosMongo {
    constructor(){
        this.product = productsModel        
    }

    async get({limit=10, page=1, sort="default"}){       
        const result =sort=="default"? 
            await this.product.paginate({}, {limit, page: pageQuery, lean: true}):
            await this.product.paginate({}, {limit, page: pageQuery, sort: {price: order[sort]}, lean: true})
        result.status="success"
        result.payload=result.docs
        return await result                               
        
    }

    async getById(pid){        
        return await this.product.findById(pid).lean()        
    }


    async create(newProduct){        
        return await this.product.create(newProduct).lean()
        
    }

    async update(pid, updateProduct){        
        return await this.product.findByIdAndUpdate({_id: pid}, updateProduct, {new: true}).lean()
    }

    async remove(pid){       
        return await this.product.findByIdAndUpdate({ _id: pid }, { isActive: false }, {new: true}).lean()      
    }

}
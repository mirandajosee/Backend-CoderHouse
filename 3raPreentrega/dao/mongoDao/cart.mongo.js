import { cartsModel } from "../models/carts.model"
import { productsModel } from "../dao/models/products.model.js";

export class CartDaoMongo{    
    constructor(){
        this.Cart = cartsModel
        this.Products = productsModel
    }

    async get(){
        try {
            return await this.Cart.find()
            
        } catch (error) {
            return  new Error(error)
        }
    }
    
    async getCartById(cid){
        try {            
            const res = await this.Cart.findOne({_id: cid}).lean()
            return res
        } catch (error) {
            return new Error(error)
        }
    }

    async createCart(){
        try {                
            return await this.Cart.create({products: [] })
        } catch (err) {
           return new Error('Error creating cart'+err);
        }
    }

    async updateCart(cid,newCart){        
        try {
            const updatedCart = await this.Cart.findOneAndUpdate({_id:cid},newCart,{new:true}).lean()
            return updatedCart
        } catch (error) {
            return new Error('Error adding product to cart'+error)
        }

    }

    // Delete api/carts/:cid/products/:pid
    async deleteItem(cid, pid){
        try {
            return await this.Cart.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            )
        } catch (error) {
            return new Error('Error deleting product from cart'+error)
        }
    }

    // vaciar carrito
    async delete(cid){
        try {
            // console.log(cid)
            return await this.Cart.findOneAndUpdate(
                { _id: cid },
                { $set: { products: [] } },
                { new: true }
            )
        } catch (error) {
            return new Error('Error deleting cart'+ error)
        }
    }
    async updateProductToCart(cid,pid,quantity){
        try{
        const cart = await cartsModel.findById({_id: cid}).lean()
        const productoId = cart.products.findIndex(prod => prod.product._id==pid)
        if (productoId!=-1){
        let newCart= cart.products
        newCart[productoId].quantity=quantity
        cart.products=newCart
        const result = await cartsModel.findOneAndUpdate({_id:cid},cart,{new:true}).lean()
        res.json(result)
        } 
        else {
            res.send("Producto no encontrado")
        }}catch(err)
        {return new Error('Error deleting cart'+ error)}
    }
    
    async addProductToCart(cartId,productId){
        try{
            const producto = await productsModel.findById({_id:productId}).lean()
            if (producto){
                const newProd = {product: productId, quantity:1}
                const newCart = await cartsModel.findOneAndUpdate({_id:cartId},{$addToSet:{products:newProd}},{new:true}).lean()
                res.send(newCart)}
            else{
                    res.status(400).send("Producto no encontrado")
                }
        }
        catch(err){
            console.log(err)
        }
    }

}
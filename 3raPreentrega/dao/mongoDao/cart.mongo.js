import { cartsModel } from "../models/carts.model.js"
import { productsModel } from "../models/products.model.js";
import { usersModel } from "../models/user.model.js";
import { ticketsModel } from "../models/tickets.model.js";

export default class CartDaoMongo{    
    constructor(){
        this.Cart = cartsModel
        this.Products = productsModel
    }

    async get(){
        try {
            return await this.Cart.find({})
            
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
            const cart = await this.Cart.findById({_id: cid}).lean()
            const productoId = cart.products.findIndex(prod => prod.product._id==pid)
                if (productoId!=-1){
                    cart.products.splice(productoId,1)
                    const newCart = await this.Cart.findOneAndUpdate({_id:cid},cart,{new:true}).lean()
                    console.log("Elemento borrado exitosamente")
                    return newCart
                } else {
                    res.send("Product Id not found")
                    return console.log("Product Id not found")
                }
        } catch (error) {
            return new Error('Error deleting product from cart'+error)
        }
    }

    // vaciar carrito
    async delete(cid){
        try {
            //const cart = await cartsModel.findById({_id: cid}).lean() chequear si existe
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
        const cart = await this.Cart.findById({_id: cid}).lean()
        const productoId = cart.products.findIndex(prod => prod.product._id==pid)
        if (productoId!=-1){
        let newCart= cart.products
        newCart[productoId].quantity=quantity
        cart.products=newCart
        const result = await this.Cart.findOneAndUpdate({_id:cid},cart,{new:true}).lean()
        res.json(result)
        } 
        else {
            res.send("Producto no encontrado")
        }}catch(error)
        {return new Error('Error deleting cart'+ error)}
    }
    
    async addProductToCart(cartId,productId){
        try{
            const producto = await productsModel.findById({_id:productId}).lean()
            if (producto){
                const newProd = {product: productId, quantity:1}
                const newCart = await this.Cart.findOneAndUpdate({_id:cartId},{$addToSet:{products:newProd}},{new:true}).lean()
                //res.send(newCart)
                return newCart
            }
            else{
                    res.status(400).send("Producto no encontrado")
                }
        }
        catch(err){
            console.log(err)
        }
    }

    async purchaseCart(cid){
        try {
            const email= (await usersModel.findOne({cartID:cid}).lean()).email
            const products= (await this.Cart.findOne({_id:cid}).lean()).products
            let amount=0
            let newCart=[]
            products.forEach(async (prod)=> 
            {
                if(prod.product.stock>=prod.quantity){
                    amount+=prod.product.price * prod.quantity
                    await productsModel.findOneAndUpdate(
                        { _id: prod.product._id },
                        { $set: { stock: prod.product.stock-prod.quantity } },
                        { new: true }
                    )
                }
                else{
                    newCart.push(prod)
                }
            })
            await this.Cart.findOneAndUpdate(
                { _id: cid },
                { $set: { products: newCart } },
                { new: true }
            )
            return await ticketsModel.create({purchaser:email,amount:amount})
            
        } catch (error) {
            return  new Error(error)
        }
    }

}
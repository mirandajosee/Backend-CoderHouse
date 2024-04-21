import { cartsModel } from "../models/carts.model.js"
import { productsModel } from "../models/products.model.js";
import { usersModel } from "../models/user.model.js";
import { ticketsModel } from "../models/tickets.model.js";
import { CustomError } from "../../errors/CustomError.js";
import { logger } from "../../logger/logger.js";

export default class CartDaoMongo{    
    constructor(){
        this.Cart = cartsModel
        this.Products = productsModel
    }

    async get(){
        try {
            return await this.Cart.find({}).lean()
            
        } catch (error) {
            return  logger.error(error)
        }
    }
    
    async getCartById(cid){
        try {            
            const res = await this.Cart.findOne({_id: cid}).lean()
            return res
        } catch (error) {
            return logger.error(error)
        }
    }

    async createCart(){
        try {                
            return await this.Cart.create({products: [] })
        } catch (err) {
           return logger.error('Error creating cart'+err);
        }
    }

    async updateCart(cid,newCart){        
        try {
            const updatedCart = await this.Cart.findOneAndUpdate({_id:cid},{ $set: { products: newCart } },{new:true}).lean()
            return updatedCart
        } catch (error) {
            return logger.error('Error adding product to cart'+error)
        }

    }

    // Delete api/carts/:cid/products/:pid
    async deleteItem(cid, pid){
        try {
            const cart = await this.Cart.findOne({_id: cid}).lean()
            if (!cart||cid.length<24){
                CustomError.createError({
                    name:"Cart not found",
                    code:3,
                    cause:"The cart does not exist in the current database",
                    message:`El carrito ${cid} no existe o no se encuentra en la base de datos actual`
                })
            }
            const productoId = cart.products.findIndex(prod => prod.product._id==pid)
            console.log(productoId)
                if (productoId!=-1){
                    cart.products.splice(productoId,1)
                    const newCart = await this.Cart.findOneAndUpdate({_id:cid},{ $set: { products: cart.products } },{new:true}).lean()
                    logger.info("Elemento borrado exitosamente")
                    return newCart
                } else {
                    CustomError.createError({
                        name:"Product not found",
                        code:3,
                        cause:"The product does not exist in the current database",
                        message:`El producto ${pid} no existe o no se encuentra en la base de datos actual`
                    })
                }
        } catch (error) {
            return logger.error('Error deleting product from cart'+error)
        }
    }

    // vaciar carrito
    async delete(cid){
        try {
            const cart = await cartsModel.findOne({_id: cid}).lean()
            if (!cart || cid.length<24){
                CustomError.createError({
                    name:"Cart not found",
                    code:3,
                    cause:"The cart does not exist in the current database",
                    message:`El carrito ${cid} no existe o no se encuentra en la base de datos actual`
                })
            }
            const result= await this.Cart.findOneAndUpdate(
                { _id: cid },
                { $set: { products: [] } },
                { new: true }
            ).lean()
            return result
        } catch (error) {
            return logger.error('Error deleting cart'+ error)
        }
    }
    async updateProductToCart(cid,pid,quantity){
        try{
        const cart = await this.Cart.findById({_id: cid}).lean()
        if (!cart || cid.length<24){
            CustomError.createError({
                name:"Cart not found",
                code:3,
                cause:"The cart does not exist in the current database",
                message:`El carrito ${cid} no existe o no se encuentra en la base de datos actual`
            })
        }
        const productoId = cart.products.findIndex(prod => prod.product._id==pid)
        if (productoId!=-1){
        let newCart= cart.products
        newCart[productoId].quantity=quantity
        cart.products=newCart
        const result = await this.Cart.findOneAndUpdate({_id:cid},cart,{new:true}).lean()
        //res.status(200).json(result)
        return result
        } 
        else {
            CustomError.createError({
                name:"Product not found",
                code:3,
                cause:"The product does not exist in the current database",
                message:`El producto ${pid} no existe o no se encuentra en la base de datos actual`
            })
        }}catch(error)
        {logger.error('Error updating cart'+ error)}
    }
    
    async addProductToCart(cartId,productId){
        try{
            const cart = await this.Cart.findOne({_id: cartId}).lean()
            if (!cart || cartId.length<24){
                CustomError.createError({
                    name:"Cart not found",
                    code:3,
                    cause:"The cart does not exist in the current database",
                    message:`El carrito ${cartId} no existe o no se encuentra en la base de datos actual`
                })
            }
            const producto = await productsModel.findOne({_id:productId}).lean()
            if (producto){
                const newProd = {product: productId, quantity:1}
                const user = await usersModel.findOne({cartID:cartId}).lean()
                if (user.email == producto.owner){
                logger.warning("No se puede agregar un producto propio al carrito")
                return 
                }else{
                const newCart = await this.Cart.findOneAndUpdate({_id:cartId},{$addToSet:{products:newProd}},{new:true}).lean()
                //res.send(newCart)
                return newCart}
            }
            
            else{
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product does not exist in the current database",
                    message:`El producto ${productId} no existe o no se encuentra en la base de datos actual`
                })
                }
        }
        catch(err){
            logger.error(err)
        }
    }

    async purchaseCart(cid){
        try {
            const cart = await this.Cart.findById({_id: cid}).lean()
            if (!cart || cid.length<24){
                CustomError.createError({
                    name:"Cart not found",
                    code:3,
                    cause:"The cart does not exist in the current database",
                    message:`El carrito ${cid} no existe o no se encuentra en la base de datos actual`
                })
            }
            const email= (await usersModel.findOne({cartID:cid}).lean()).email
            if (!email){
                CustomError.createError({
                    name:"User not found",
                    code:3,
                    cause:"There is no mail for this cart",
                    message:`El carrito ${cid} no fue asignado a un mail correctamente`
                })
            }
            const products= (await this.Cart.findOne({_id:cid}).lean()).products
            let amount=0
            let newCart=[]
            let purchasedCart=[]
            products.forEach(async (prod)=> 
            {
                if(prod.product.stock>=prod.quantity){
                    purchasedCart.push(prod)
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

            await ticketsModel.create({purchaser:email,amount:amount,products:purchasedCart})
            const ticket = await ticketsModel.findOne({purchaser:email,amount:amount},{},{sort:{'purchase_datetime':-1}}).lean()
            return ticket
            
        } catch (error) {
            return  logger.error(error)
        }
    }

}
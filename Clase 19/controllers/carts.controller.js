import { CommandInstance } from "twilio/lib/rest/preview/wireless/command.js"
import { cartService, productService, userService } from "../repositories/services.js"
import { sendMail } from "../utils.js"
import { logger } from "../logger/logger.js"

export class CartController{
    constructor(){}

    getCartById= async(req, res) => {
        try{
        let cartId = req.params.cid
        if (!cartId ){
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were missing or had a wrong type",
                code:"2",
                message:`Dato faltante o de tipo incorrecto\n Se recibió cartId=${typeof(cartId)}`
            })
        }
        const cart = await cartService.getCartById(cartId)
        cart? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' })
        
        }catch(err){
            logger.error(err)
        }
    }
    createCart= async(req, res) => {
        try{
            const newCart = await cartService.createCart(email=req.session.user.email)
            res.json(newCart)
            }
        catch(err){
            logger.error(err)
        }
    }
    updateCart=async(req, res) => {
        try{
            const cid = req.params.cid
            const newCart=req.body
            if (!cid || !newCart ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió cid=${typeof(cid)},newCart=${typeof(newCart)}`
                })
            }
            const result= await cartService.updateCart(cid,newCart)
            res.json(result)
            }
        catch(err){
            logger.error(err)
        }
    }
    deleteCart=async(req, res) => {
        try{
            const cid = req.params.cid
            if (!cid ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió cid=${typeof(cid)}`
                })
            }
            newCart = await cartService.delete(cid)
            res.json(newCart)
            return logger.info("Carrito vacío exitosamente")
            }
        catch(err){
            logger.error(err)
        }
    }

    addProductToCart=async(req, res) => {
        try{
            // para testear se puede usar 
            //let cid= "65ca2a74be97e0dca5dc3ac8"
            //let pid= "65bf2577eb4489fe2f045def"
            let cartID = req.params.cid
            let productId = req.params.pid
            if (!cartID || !productId ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió cartId=${typeof(cartID)},productId=${typeof(productId)}}`
                })
            }
            const product = await productService.getProductById(productId)
            if (!product){
                CustomError.createError({
                    name:"Product not found",
                    cause:"This product does not exist",
                    code:"3",
                    message:`El producto no se encontró en la base de datos actual\n Se recibió pid=${productId}`
                })
            }
            if ((req.session.user.email == product.owner) && req.session.user.role!="admin"){
                CustomError.createError({
                    name:"Cannot add to Cart",
                    cause:"Invalid user",
                    code:"2",
                    message:`No puede comprar sus propios productos\n Se recibió email=${req.session.user.email}`
                })
            }
            const result= await cartService.addProductToCart(cartID, productId)
            
            res.json(result)
        }
        catch(err){
            logger.error(err)
        }
    }

    updateProductToCart=async(req, res) => {
        try{
            const {cid,pid} = req.params
            const quantity=parseInt(req.body.quantity)
            if (!quantity || !cid|| !pid ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió pid=${typeof(pid)},cid=${typeof(cid)},quantity=${typeof(quantity)}`
                })
            }
            result= await cartService.updateProductToCart(cid,pid,quantity)
            res.json(result)
            }
        catch(err){
            logger.error(err)
        }
    }

    deleteProductFromCart=async(req, res) => {
        try{
            const {cid,pid} = req.params
            const result = await cartService.deleteItem(cid,pid)
            res.send(result)
            }
        catch(err){
            logger.error(err)
        }
    }

    purchaseCart=async(req, res) =>{
        try{
            const {cid} = req.params
            const ticket = await cartService.purchaseCart(cid)
            const subject = `Gracias por tu compra`
            const html = `<div><h1>Tu compra fue exitosa</h1><br>
            <h3>Monto: $${ticket.amount}</h3><br>
            <h3>Código: ${ticket.code}</h3>`
            const to=ticket.purchaser
            await sendMail(to, subject, html)
            res.send(ticket)
        }
        catch(err){
            logger.error(err)
        }
    }

}
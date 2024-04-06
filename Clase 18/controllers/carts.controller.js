import { CommandInstance } from "twilio/lib/rest/preview/wireless/command.js"
import { cartService } from "../repositories/services.js"
import { sendMail } from "../utils.js"

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
            console.log(err)
        }
    }
    createCart= async(req, res) => {
        try{
            const newCart = cartService.createCart()
            res.json(newCart)
            }
        catch(err){
            console.log(err)
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
            const result= cartService.updateCart(cid,newCart)
            res.json(result)
            }
        catch(err){
            console.log(err)
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
            newCart = cartService.delete(cid)
            res.json(newCart)
            return console.log("Carrito vacío exitosamente")
            }
        catch(err){
            console.log(err)
        }
    }

    addProductToCart=async(req, res) => {
        try{
            // para testear se puede usar 
            //let cid= "65ca2a74be97e0dca5dc3ac8"
            //let pid= "65bf2577eb4489fe2f045def"
            let cartId = req.params.cid
            let productId = req.params.pid
            if (!cartId || !productId ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió cartId=${typeof(cartId)},productId=${typeof(productId)}}`
                })
            }
            result= cartService.addProductToCart(cartId, productId)
            res.json(result)
        }
        catch(err){
            console.log(err)
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
            result=cartService.updateProductToCart(cid,pid,quantity)
            res.json(result)
            }
        catch(err){
            console.log(err)
        }
    }

    deleteProductFromCart=async(req, res) => {
        try{
            const {cid,pid} = req.params
            const result = cartService.deleteItem(cid,pid)
            res.send(result)
            }
        catch(err){
            console.log(err)
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
            console.log(err)
        }
    }

}
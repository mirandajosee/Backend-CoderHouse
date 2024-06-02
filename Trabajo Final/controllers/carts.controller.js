import { cartService, productService, userService } from "../repositories/services.js"
import { sendMail } from "../utils.js"
import { logger } from "../logger/logger.js"
import {MercadoPagoConfig, Preference} from 'mercadopago'

const client = new MercadoPagoConfig({accessToken:"TEST-8936031347205029-053121-6f7d4d746f03f3cb04aefabf06ff619f-1838927604"})

export class CartController{
    constructor(){}

    getCarts = async(req,res)=>{
        try{
            const result = await cartService.getCarts()
            res.status(200).send(result)
        }catch(err){
            logger.error(err)
        }
    }
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
        cart? res.json(cart) : res.status(404).json({ error: 'Carrito no encontrado' })
        
        }catch(err){
            logger.error(err)
        }
    }
    createCart= async(req, res) => {
        try{
            await cartService.createCart()
            res.json("Carrito creado con éxito")
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
            const newCart = await cartService.delete(cid)
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
            const result= await cartService.updateProductToCart(cid,pid,quantity)
            res.json(result)
            }
        catch(err){
            logger.error(err)
        }
    }

    deleteProductFromCart=async(req, res) => {
        try{
            const {cid,pid} = req.params
            const result = await cartService.deleteProductFromCart(cid,pid)
            res.send(result)
            }
        catch(err){
            logger.error(err)
        }
    }

    purchaseCart=async(req, res) =>{
        try{
            const {cid} = req.params
            const cart = await cartService.getCartById(cid)
            const fullURL = req.protocol + '://' + req.get('host')
            let MPitems = []
            for (let prod of cart.products){
                let product = {title:prod.product.title, quantity:prod.quantity, unit_price:prod.product.price, id:prod.product._id, currency_id:"ARS"}
                MPitems.push(product)}
            const MPbody = {
                back_urls:{
                    success:fullURL,
                    failure:fullURL,
                    pending:fullURL
                },
                auto_return:"approved",
            }
            MPbody.items=MPitems
            const preference = new Preference(client)
            console.log(preference)
            const result = await preference.create({body:MPbody})
            const ticket = await cartService.purchaseCart(cid)
            
            const to=ticket.purchaser
            const subject = `Gracias por tu compra`
            const html = `<div><h1>Gracias por tu compra</h1><br>
                <h3>Monto: $${ticket.amount}</h3><br>
                <h3>Código: ${ticket.code}</h3>
            `
            await sendMail(to, subject, html)
            res.send({ticket:ticket, id: result.id})
        }catch(err){
            logger.error(err||err.message)
        }
    }

}
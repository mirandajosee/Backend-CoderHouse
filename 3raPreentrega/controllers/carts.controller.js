import { cartService } from "../repositories/services.js"
import { sendMail } from "../utils.js"

export class CartController{
    constructor(){}

    getCartById= async(req, res) => {
        try{
        let cartId = req.params.cid
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
            const quantity=req.body.quantity
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
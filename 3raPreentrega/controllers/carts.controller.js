import CartManager from "../dao/CartManager.js"
import { persistencia } from "../utils.js"
import { cartsModel } from "../dao/models/carts.model.js"
import { productsModel } from "../dao/models/products.model.js";

const CM=new CartManager()

export class CartController{
    constructor(){}

    getCart= async(req, res) => {
        try{
        let cartId = req.params.cid
    
        if (persistencia=="FS"){
        const cart = CM.getCartById(cartId)
        if (cart) {
            res.json(cart.products)
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' })
        }}
    
        if(persistencia=="DB"){
            const cart = await cartsModel.findById({_id:cartId}).lean()
            cart? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' })
        }
        }catch(err){
            console.log(err)
        }
    }
    createCart= async(req, res) => {
        try{
            if(persistencia=="FS"){
                const newCart = CM.createCart()
                console.log(newCart)
                res.json(newCart)}
            if(persistencia=="DB"){
                const newCart= await cartsModel.create({products:[]})
                res.json(newCart)
            }}
        catch(err){
            console.log(err)
        }
    }
    updateCart=async(req, res) => {
        try{
            const newCart=req.body
            const result= await cartsModel.findOneAndUpdate({_id:cid},newCart,{new:true}).lean()
            res.json(result)
            }
        catch(err){
            console.log(err)
        }
    }
    deleteCart=async(req, res) => {
        try{
            const cid = req.params.cid
            const cart = await cartsModel.findById({_id: cid}).lean()
                if (cart){
                    cart.products=[]
                    const newCart = await cartsModel.findOneAndUpdate({_id:cid},cart,{new:true}).lean()
                    res.json(newCart)
                    return console.log("Carrito vacío exitosamente")
                } else {
                    res.send("Carrito no encontrado")
                    return console.log("Carrito no encontrado")
                }
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
            if(persistencia=="FS"){
                CM.addProductToCart(cartId, productId)
                res.json({ success: true })}
            if(persistencia=="DB"){
                const producto = await productsModel.findById({_id:productId}).lean()
                if (producto){
                const newProd = {product: productId, quantity:1}
                const newCart = await cartsModel.findOneAndUpdate({_id:cartId},{$addToSet:{products:newProd}},{new:true}).lean()
                res.send(newCart)}
                else{
                    res.status(400).send("Producto no encontrado")
                }
            }}
        catch(err){
            console.log(err)
        }
    }

    updateProductToCart=async(req, res) => {
        try{
            const {cid,pid} = req.params
            const quantity=req.body.quantity
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
            }
            }
        catch(err){
            console.log(err)
        }
    }

    deleteProductFromCart=async(req, res) => {
        try{
            const {cid,pid} = req.params
            const cart = await cartsModel.findById({_id: cid}).lean()
            const productoId = cart.products.findIndex(prod => prod.product._id==pid)
                if (productoId!=-1){
                    cart.products.splice(productoId,1)
                    const newCart = await cartsModel.findOneAndUpdate({_id:cid},cart,{new:true}).lean()
                    res.json(newCart)
                    return console.log("Elemento borrado exitosamente")
                } else {
                    res.send("Product Id not found")
                    return console.log("Product Id not found")
                }
            }
        catch(err){
            console.log(err)
        }
    }

    purchaseCart=async(req, res) =>{
        try{
            const {cid} = req.params
            const cart = await cartsModel.findById({_id: cid}).lean()
        }
        catch(err){
            console.log(err)
        }
    }

}
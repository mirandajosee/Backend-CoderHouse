import {Router} from "express"
import { CartManager } from "../dao/CartManager.js";
import { persistencia } from "../utils.js";
import { cartsModel } from "../dao/models/carts.model.js";

const CM=new CartManager()
const cartRouter = Router()

cartRouter.post('/', async(req, res) => {
    try{
        if(persistencia=="FS"){
            const newCart = CM.createCart()
            console.log(newCart)
            res.json(newCart)}
        if(persistencia=="DB"){
            const newCart= await cartsModel.create({})
            res.json(newCart)
        }}
    catch(err){
        console.log(err)
    }
});

cartRouter.get('/:cid', async(req, res) => {
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
});

cartRouter.post('/:cid/product/:pid', async(req, res) => {
    try{
        let cartId = req.params.cid
        let productId = req.params.pid
        if(persistencia=="FS"){
            CM.addProductToCart(cartId, productId)
            res.json({ success: true })}
        if(persistencia=="DB"){
            let prods= await cartsModel.findOne({_id:cartId}).lean().products
            prods = prods.append([{product: productId, quantity:1}])
            await cartsModel.updateOne({_id:cartId,prods})
        }}
    catch(err){
        console.log(err)
    }
});

export {cartRouter}
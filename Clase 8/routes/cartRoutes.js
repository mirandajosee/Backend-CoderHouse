import {Router} from "express"
import { CartManager } from "../dao/CartManager.js";

const CM=new CartManager()
const cartRouter = Router()

cartRouter.post('/', (req, res) => {
    const newCart = CM.createCart()
    console.log(newCart)
    res.json(newCart)
});

cartRouter.get('/:cid', (req, res) => {
    let cartId = req.params.cid
    const cart = CM.getCartById(cartId)
    if (cart) {
        res.json(cart.products)
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' })
    }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    CM.addProductToCart(cartId, productId)
    res.json({ success: true })
});

export {cartRouter}
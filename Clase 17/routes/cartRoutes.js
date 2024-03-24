import {Router} from "express"
import { CartController } from "../controllers/carts.controller.js";

const cartRouter = Router()

const {
    getCart,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart,
    updateProductToCart,
    deleteProductFromCart,
    purchaseCart
} = new CartController()

cartRouter.post('/', createCart)
cartRouter.get('/:cid', getCart)
cartRouter.put('/:cid', updateCart)
cartRouter.delete('/:cid', deleteCart)
cartRouter.post('/:cid/products/:pid', addProductToCart)
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart)
cartRouter.put('/:cid/products/:pid', updateProductToCart)
cartRouter.post('/:cid/purchase', purchaseCart)

export {cartRouter}
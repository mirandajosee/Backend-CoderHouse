import {Router} from "express"
import { CartController } from "../controllers/carts.controller.js";
import { allow } from "../middleware/authentication.js";
const cartRouter = Router()

const {
    getCartById,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart,
    updateProductToCart,
    deleteProductFromCart,
    purchaseCart
} = new CartController()

cartRouter.post('/', createCart)
cartRouter.get('/:cid', getCartById)
cartRouter.put('/:cid', updateCart)
cartRouter.delete('/:cid', deleteCart)
cartRouter.post('/:cid/products/:pid',(req,res,next) => allow(req,res,next,["user","premium"]) ,addProductToCart)
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart)
cartRouter.put('/:cid/products/:pid', updateProductToCart)
cartRouter.post('/:cid/purchase', purchaseCart)

export {cartRouter}
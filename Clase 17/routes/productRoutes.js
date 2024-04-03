import {Router} from "express"
import { ProductController } from "../controllers/products.controller.js"
import { allow } from "../middleware/authentication.js"

const productRouter = Router()

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    mockingProducts
} = new ProductController()

productRouter.get('/mockingproducts', mockingProducts)
productRouter.get('/', getProducts)
productRouter.get('/:pid', getProduct)
productRouter.post('/',(req,res,next) => allow(req,res,next,["admin"]), createProduct)
productRouter.put('/:pid',(req,res,next) => allow(req,res,next,["admin"]), updateProduct)
productRouter.delete('/:pid',(req,res,next) => allow(req,res,next,["admin"]), deleteProduct)

export {productRouter}
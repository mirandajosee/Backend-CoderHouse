import {Router} from "express"
import { ProductController } from "../controllers/products.controller.js"


const productRouter = Router()

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProduct)
productRouter.post('/', createProduct)
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);

export {productRouter}
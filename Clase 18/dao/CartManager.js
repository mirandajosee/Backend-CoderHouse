import fs from "node:fs"
import { CustomError } from "../errors/CustomError"
import { logger } from "../logger/logger.js"

export default class CartManager {
    constructor() {
        this.path = "./carts.json"
        this.carts = []
        this.get()
    }

    createCart = () => {

        const lastId = this.carts.slice(-1)[0]? Math.max(this.carts.length,this.carts.slice(-1)[0].id)+1 : 1
        
        
        const newCart = {
            id: lastId,
            products: []
        }
        this.carts.push(newCart)
        this.saveCartsToFile()
        logger.debug('carrito creado')
        return newCart
    }

    addProductToCart = (cartId, productId) => {
        cartId=parseInt(cartId)
        productId=parseInt(productId)
        const cart = this.getCartById(cartId)
        if (cart) {
            const existingProduct = cart.products.find(product => product.product === productId);
            if (existingProduct) {
                existingProduct.quantity++
            } else {
                //agregar si no existe el pid
                cart.products.push({ product: productId, quantity: 1 })
            }

            this.saveCartsToFile()
            return cart
        }
        else {
                CustomError.createError({
                    name:"Cart not found",
                    code:3,
                    cause:"The cart does not exist in the current database",
                    message:`El carrito ${cartId} no existe o no se encuentra en la base de datos actual`
                })
            }
        }
    

    getCartById = (id) => {
        id=parseInt(id)
        const cart = this.carts.find(cart => cart.id == id)
        if (cart){return cart}
        else{
                CustomError.createError({
                    name:"Cart not found",
                    code:3,
                    cause:"The cart does not exist in the current database",
                    message:`El carrito ${id} no existe o no se encuentra en la base de datos actual`
                })
        }
    }

    saveCartsToFile = () => {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8')
    }

    get() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8')
            logger.debug(data)
            this.carts = JSON.parse(data) || []
        } catch (error) {
            this.carts = [];
        }
    }
}
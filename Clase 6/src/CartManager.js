import fs from "node:fs"

export class CartManager {
    constructor() {
        this.path = "./carts.json"
        this.carts = []
        this.loadCartsFromFile()
    }

    createCart = () => {

        const lastId = this.carts.slice(-1)[0]? Math.max(this.carts.length,this.carts.slice(-1)[0].id)+1 : 1
        
        
        const newCart = {
            id: lastId,
            products: []
        }
        this.carts.push(newCart)
        this.saveCartsToFile()
        console.log('carrito creado')
        return newCart
    }

    addProductToCart = (cartId, productId) => {
        const cart = this.getCartById(cartId)
        if (cart) {
            const existingProduct = cart.products.find(product => product.product === productId);
            if (existingProduct) {
                existingProduct.quantity++
            } else {
                cart.products.push({ product: productId, quantity: 1 })
            }

            this.saveCartsToFile();
        }
    }

    getCartById = (id) => {
        const cart = this.carts.find(cart => cart.id == id)
        if (cart){return cart}
        else{
            return console.log("Error 404, no se encontró este cart")
        }
    }

    saveCartsToFile = () => {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8')
    }

    loadCartsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8')
            console.log(data)
            this.carts = JSON.parse(data) || []
        } catch (error) {
            this.carts = [];
        }
    }
}
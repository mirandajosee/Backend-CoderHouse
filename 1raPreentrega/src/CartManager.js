import fs from "node:fs"

export class CartManager {
    constructor(filePath) {
        this.path = filePath
        this.carts = []
        this.loadCartsFromFile()
    }

    createCart = () => {
        const lastId= this.carts.length>=carts[-1].id? this.carts.length++ : carts[-1].id++
        const newCart = {
            id: lastId,
            products: []
        };
        this.carts.push(newCart)
        this.saveCartsToFile()
        console.log('carrito creado')
        return newCart
    }

    addProductToCart = (cartId, productId) => {
        const cart = this.getCartById(cartId)
        if (cart) {
            const existingProduct = cart.products.find(product => product.id === productId);
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
        return cart
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
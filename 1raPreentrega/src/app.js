import {ProductManager,Product}  from "./ProductManager.js"
import express from "express"
import { CartManager } from "./CartManager.js"

const PM=new ProductManager()
const CM=new CartManager()
const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json())

// Rutas para los productos

app.get('/api/products', (req, res)=> {
    const limit = Number(req.query.limit)
    limit? res.json(PM.getProducts().slice(0,limit)) : res.json(PM.getProducts())
})

app.get('/api/products/:pid',(req,res) =>{
    const pid = Number(req.params.pid)
    const producto=PM.getProductById(pid)
    producto? res.json(producto) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')
})

app.post('/api/products', (req, res) => {
    const newProduct = req.body
    PM.addProduct(newProduct)
    res.json(newProduct)
});

app.put('/api/products/:pid', (req, res) => {
    const updatedProduct = req.body
    let id = parseInt(req.params.pid)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Formato de id inválido' })
        return;
    }

    PM.updateProduct(id, updatedProduct);
    res.json(updatedProduct)
});

app.delete('/api/products/:pid', (req, res) => {
    let id = parseInt(req.params.pid)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Formato de id inválido' });
        return;
    }

    PM.deleteProduct(id);
    res.json({ Resultado: 'Producto eliminado correctamente' })

});


// Rutas para el cart


app.post('/api/carts', (req, res) => {
    const newCart = CM.createCart()
    console.log(newCart)
    res.json(newCart)
});

app.get('/api/carts/:cid', (req, res) => {
    let cartId = req.params.cid
    const cart = CM.getCartById(cartId)
    if (cart) {
        res.json(cart.products)
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' })
    }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    CM.addProductToCart(cartId, productId)
    res.json({ success: true })
});

app.listen(8080, ()=>{
    console.log('Escuchando en el puerto 8080')
})
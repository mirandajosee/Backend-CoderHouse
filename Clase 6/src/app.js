import express from "express"
import { productRouter } from "../routes/productRoutes.js"
import { cartRouter } from "../routes/cartRoutes.js"

const PORT = 8080
const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.listen(PORT, ()=>{
    console.log('Escuchando en el puerto 8080')
})

// Rutas para los productos
app.use('/api/products/', productRouter)
// Rutas para el cart
app.use('/api/carts/', cartRouter)

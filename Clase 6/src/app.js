import express from "express"
import { productRouter } from "../routes/productRoutes.js"
import { cartRouter } from "../routes/cartRoutes.js"
import { viewsRouter } from "../routes/viewsRoutes.js"
import { Server as ServerIO } from "socket.io"
import  __dirname from "../utils.js"
import handlebars from "express-handlebars"
import { ProductManager } from "./ProductManager.js"
import cors from "cors"
const productManager= new ProductManager()
const PORT = 8080
const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cors())

// Rutas para los productos
app.use('/api/products/', productRouter)
// Rutas para el cart
app.use('/api/carts/', cartRouter)
//Ruta de views
app.use('/',viewsRouter)

const httpServer= app.listen(PORT, ()=>{
    console.log('Escuchando en el puerto 8080')
})

let productList=[]
const io = new ServerIO(httpServer)

app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))

io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    // Escuchando newProduct
    socket.on('newProduct', data => {
        let newProductId = productManager.addProduct(data)
        let newProduct = { ...data, id: newProductId }
        productList.push(newProduct);
        
        // Emitiendo updateList
        io.emit('updateList', productManager.getProducts())
        
    });
    // Escuchando deleteProducts
    socket.on('deleteProduct', productId => {
        const productList = productManager.getProducts();
        const filteredList = productList.filter(product => product.id != productId.id);
        productManager.deleteProduct(productId.id)
        // Emitiendo updateList
        io.emit('updateList', filteredList)
    });
})
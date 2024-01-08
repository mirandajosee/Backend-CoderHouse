import express from "express"
import { productRouter } from "../routes/productRoutes.js"
import { cartRouter } from "../routes/cartRoutes.js"
import { Server } from "socket.io"
import { __dirname } from "../utils.js"
import { ExpressHandlebars } from "express-handlebars"


const PORT = 8080
const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json())


const httpServer= app.listen(PORT, ()=>{
    console.log('Escuchando en el puerto 8080')
})

const io = new Server(httpServer)

io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    // Escuchando newProduct
    socket.on('newProduct', data => {
        let newProductId = productManager.addProduct(data);
        let newProduct = { ...data, id: newProductId };
        productList.push(newProduct);
        
        // Emitiendo updateList
        io.emit('updateList', productManager.getProducts());
        
    });
    // Escuchando deleteProducts
    socket.on('deleteProduct', productId => {
        const productList = productManager.getProducts();
        const filteredList = productList.filter(product => product.id != productId.id);
        productManager.deleteProduct(productId.id);
        // Emitiendo updateList
        io.emit('updateList', filteredList);
    });
});

app.engine('handlebars',ExpressHandlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));

// Rutas para los productos
app.use('/api/products/', productRouter)
// Rutas para el cart
app.use('/api/carts/', cartRouter)

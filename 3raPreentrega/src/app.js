import express from "express"
import { productRouter } from "../routes/productRoutes.js"
import { cartRouter } from "../routes/cartRoutes.js"
import { sessionRouter } from "../routes/sessionRoutes.js"
import { viewsRouter } from "../routes/viewsRoutes.js"
import { Server as ServerIO } from "socket.io"
import  __dirname from "../utils.js"
import { create } from "express-handlebars"
import { connectBD } from "../config/connectDB.js"
import cors from "cors"
import { productService, cartService } from "../repositories/services.js"
import { messagesModel } from "../dao/models/messages.model.js"
import session from "express-session"
import passport from "passport"
import { initializePassport } from "../config/passportConfig.js"
import { default as MongoStore } from "connect-mongo"
import { config as dotenvConfig } from "dotenv"
dotenvConfig({path:'./.env.production'})


const PORT = 8080 || window.location.port
connectBD()
const app = express()
const handlebars = create({})

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cors())
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 15000000000 * 24
    }), 
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))


// Rutas para los productos
app.use('/api/products/', productRouter)
// Rutas para el cart
app.use('/api/carts/', cartRouter)
// Rutas para los users
app.use('/api/users/', sessionRouter)
//Ruta de views
app.use('/',viewsRouter)

const httpServer= app.listen(PORT, ()=>{
    console.log(`Escuchando en el puerto ${PORT}`)
})

let productList=[]
const io = new ServerIO(httpServer)
let mensajes = []


app.engine('handlebars', handlebars.engine)
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))


initializePassport()
app.use(passport.initialize())
app.use(passport.session())



io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    // Escuchando newProduct
    socket.on('newProduct', async(data) => {
        try
        {
        productList.push(await productService.addProduct(data))
        }catch(err){
            console.log(err)
        }
        
        // Emitiendo updateList
        io.emit('updateList', async()=>{
            try{
                await productService.getProducts()
            }catch(err){
                console.log(err)
            }
        })
        
        
    })
    // Escuchando deleteProducts
    socket.on('deleteProduct', async (productId) => {
        try{
            const filteredList=await productService.deleteProduct(productId)
            io.emit('updateList', filteredList)}
        catch(err)
        {console.log(err)}
    });

    socket.on('message' ,async(data) => {
        try{
        //mensajes.push(data)
        await messagesModel.create(data)
        mensajes=await messagesModel.find({}).lean()
        io.emit('messageLogs', mensajes)}
        catch(err){
            console.log(err)
        }
    })

    socket.on("addToCart", async(data)=>{
        try{
            const productId=data.pid
            const cartId=data.cid
            const producto = await productService.getProductById(productId)
            if (producto){
            cartService.addProductToCart(cartId,productId)
        }
            else{
                res.status(400).send("Producto no encontrado")
            }
        }
        catch(err)
        {console.log(err)}
    })
})
import express from "express"
import { productRouter } from "../routes/productRoutes.js"
import { cartRouter } from "../routes/cartRoutes.js"
import { sessionRouter } from "../routes/sessionRoutes.js"
import { viewsRouter } from "../routes/viewsRoutes.js"
import { testingRouter } from "../routes/testingRoutes.js"
import { Server as ServerIO } from "socket.io"
import  {__dirname,env} from "../utils.js"
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
import { CustomError } from "../errors/CustomError.js"
import { handleErrors } from "../errors/handleErrors.js"
import { addLogger,logger } from "../logger/logger.js"
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'


switch(env){
    case "PROD": 
        dotenvConfig({path:'./.env.production'})
        break;

    case "DEV": 
        dotenvConfig({path:'./.env.development'})
        break;
    default: 
        dotenvConfig({path:'./.env.production'})
        break;
}


const PORT = process.env.PORT || window.location.port
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
app.use(addLogger)
app.use(handleErrors)

// swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Backend de Mirai Ecommerce',
            description: 'Documentación del proyecto de Backend para Coderhouse'
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
  }
  
  const specs = swaggerJSDoc(swaggerOptions)
  app.use('/apidocs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Rutas para los productos
app.use('/api/products/', productRouter)
// Rutas para el cart
app.use('/api/carts/', cartRouter)
// Rutas para los users
app.use('/api/users/', sessionRouter)
//Ruta de views
app.use('/',viewsRouter)
//Ruta de pruebas
app.use('/testing/',testingRouter)



const httpServer= app.listen(PORT, ()=>{
    logger.debug(`Escuchando en el puerto ${PORT}`)
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
    logger.debug('Nuevo cliente conectado');
    // Escuchando newProduct
    socket.on('newProduct', async(data) => {
        try
        {
        await productService.addProduct(data)
        productList=await productService.getProducts()
        io.emit('updateList', productList)
        }catch(err){
            logger.error(err)
        }
        
        // Emitiendo updateList
        io.emit('updateList', productList)
        
        
    })
    // Escuchando deleteProducts
    socket.on('deleteProduct', async (productId) => {
        try{
            const producto = await productService.getProductById(productId.id)
            if (productId.owner=="admin" || productId.owner==producto.owner){
            await productService.deleteProduct(productId.id)
            const filteredList= await productService.getProducts()
            io.emit('updateList', filteredList)}else{
                logger.warning("Borrado no exitoso debido a permisos")
            }}
        catch(err)
        {logger.error(err)}
    });

    socket.on('message' ,async(data) => {
        try{
        //mensajes.push(data)
        await messagesModel.create(data)
        mensajes=await messagesModel.find({}).lean()
        io.emit('messageLogs', mensajes)}
        catch(err){
            logger.error(err)
        }
    })

    socket.on("addToCart", async(data)=>{
        try{
            const productId=data.pid
            const cartId=data.cid
            const producto = await productService.getProductById(productId)
            if (producto){
            await cartService.addProductToCart(cartId,productId)
        }
            else{
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product id does not exist in the current database",
                    message:`El producto con id ${productId} no existe en la base de datos actual`
                })
            }
        }
        catch(err)
        {logger.warning(err)}
    })
})



//app.use('*', async (req, res)=>{
//    CustomError.createError({
//        name:"Routing error",
//        cause:"This path does not exist",
//        message:"This endpoint or file does not exist, check the grammar or the existance of the path",
//        code:EnumErrors.ROUTING_ERROR
//    })
//})
import express from "express"
import { productRouter } from "../routes/productRoutes.js"
import { cartRouter } from "../routes/cartRoutes.js"
import { viewsRouter } from "../routes/viewsRoutes.js"
import { Server as ServerIO } from "socket.io"
import  __dirname from "../utils.js"
import { create } from "express-handlebars"
import { ProductManager } from "../dao/ProductManager.js"
import { persistencia } from "../utils.js"
import { connectBD } from "../config/connectDB.js"
import cors from "cors"
import { productsModel } from "../dao/models/products.model.js"
import { messagesModel } from "../dao/models/messages.model.js"

const productManager= new ProductManager()
const PORT = 8080 || window.location.port
connectBD()
const app = express()
const handlebars = create({})

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
    console.log(`Escuchando en el puerto ${PORT}`)
})

let productList=[]
const io = new ServerIO(httpServer)
let mensajes = []

app.engine('handlebars', handlebars.engine)
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))

io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    // Escuchando newProduct
    socket.on('newProduct', async(data) => {
        try
        {if (persistencia=="FS"){
        let newProductId = productManager.addProduct(data)
        let newProduct = { ...data, id: newProductId }
        productList.push(newProduct)}

        if (persistencia=="DB"){
        await productsModel.create(data)
        let id= await productsModel.findOne({title:data.title}).lean()._id
        productList.push({...data,id:id})
        }}catch(err){
            console.log(err)
        }
        
        // Emitiendo updateList
        io.emit('updateList', async()=>{
            try{
            if (persistencia=="FS"){
            productManager.getProducts()}

            if (persistencia=="DB"){
            await productsModel.find({}).lean()
            }}catch(err){
                console.log(err)
            }
        })
        
        
    })
    // Escuchando deleteProducts
    socket.on('deleteProduct', async (productId) => {
        try{
            if (persistencia=="FS"){
            const productList = productManager.getProducts();
            const filteredList = productList.filter(product => product.id != productId.id)
            productManager.deleteProduct(productId.id)
            // Emitiendo updateList
            io.emit('updateList', filteredList)}

            if (persistencia=="DB"){
                const productList= await productsModel.find({}).lean()
                const filteredList= productList.filter(product => product._id != productId._id)
                await productsModel.findByIdAndDelete({_id:productId._id})
                io.emit('updateList', filteredList)}
            }
        
        catch(err)
        {console.log(err)}
    });

    socket.on('message', async(data) => {
        try{
        //mensajes.push(data)
        await messagesModel.create(data)
        mensajes=await messagesModel.find({}).lean()
        io.emit('messageLogs', mensajes)}
        catch(err){
            console.log(err)
        }
    })
})
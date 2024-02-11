import express from "express"
import { ProductManager } from "../dao/ProductManager.js";
import { productsModel } from "../dao/models/products.model.js";
import { messagesModel } from "../dao/models/messages.model.js";
import { cartsModel } from "../dao/models/carts.model.js";
import { persistencia } from "../utils.js";

const viewsRouter = express.Router();
const productManager = new ProductManager();


viewsRouter.get('/',async (req,res)=>{
    const {limit=10,page=1,sort="default"}=req.query
    const order={"asc":1,"desc":-1}
    try{
        const {
            docs,
            hasPrevPage, 
            hasNextPage,
            prevPage, 
            nextPage,
            pageAct
        } =sort=="default"? 
        await productsModel.paginate({}, {limit, page: page, lean: true}):
        await productsModel.paginate({}, {limit, page: page, sort: {price: order[sort]}, lean: true})
        

    if (persistencia=="FS"){
    const products = productManager.getProducts()
    res.render('index', { products })}

    if(persistencia=="DB"){
        const products= await productsModel.find({}).lean()
        res.render('index', { products,limit,sort,page,
            docs,
            hasPrevPage, 
            hasNextPage,
            prevPage, 
            nextPage,
            pageAct })
    }}
    catch(err){
        console.log(err)
    }
});


//Vista de home, en desarrollo
viewsRouter.get('/home', (req, res) => {
    res.render('test', { });
});

//Vista de real time products
viewsRouter.get('/realtimeproducts', async(req, res) => {
    try{
        if (persistencia=="FS"){
        const products = productManager.getProducts()
        res.render('realtimeproducts', { products })}
    
        if(persistencia=="DB"){
            const products= await productsModel.find({}).lean()
            res.render('realtimeproducts', { products })
        }}
        catch(err){
            console.log(err)
        }
    })

viewsRouter.get('/chat', async(req, res) => {
    try{
    const chat=await messagesModel.find({}).lean()
    res.render('chat', { chat})}
    catch(err){
        console.log(err)
    }
}); 

export {viewsRouter}
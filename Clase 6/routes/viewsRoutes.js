import express from "express"
import { ProductManager } from "../dao/ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager();


viewsRouter.get('/',(req,res)=>{
    const products = productManager.getProducts();
    res.render('index', { products });
});


//Vista de home
viewsRouter.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('test', { products });
});

//Vista de real time products
viewsRouter.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realtimeproducts', { products });
}); 

viewsRouter.get('/chat', (req, res) => {
    res.render('chat', { });
}); 

export {viewsRouter}
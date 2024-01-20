import express from "express"
import { ProductManager } from "../src/ProductManager.js";

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

export {viewsRouter}
import express from "express"
import { messagesModel } from "../dao/models/messages.model.js";
import { productService,cartService,userService } from "../repositories/services.js";
import { CustomError } from "../errors/CustomError.js";
import { logger } from "../logger/logger.js";
import { checkToken } from "../utils.js";

const viewsRouter = express.Router();


viewsRouter.get('/',async (req,res)=>{
    res.redirect("/products")
});


//Vista de home, en desarrollo
viewsRouter.get('/home', (req, res) => {
    res.render('test', { });
});

//Vista de real time products, agregar middleware
viewsRouter.get('/realtimeproducts', async(req, res) => {
    try{
        const products = await productService.getProducts({})
        res.render('realtimeproducts', { products })
        }
    catch(err){
            logger.error(err)
        }
    })

viewsRouter.get('/chat', async(req, res) => {
    try{
    const chat=await messagesModel.find({}).lean()
    const role=req.session.user.role
    res.render('chat', { chat,role})}
    catch(err){
        logger.error(err)
    }
}); 

viewsRouter.get('/products',async (req,res)=>{
    const {limit=10,page=1,sort="default"}=req.query
    const user=req.session.user
    try{
        const {docs,
            hasPrevPage, 
            hasNextPage,
            prevPage, 
            nextPage,
            pageAct
            }= await productService.getPageProducts({limit:limit,pageQuery:page,sort:sort})
        const products = await productService.getProducts({limit:limit})
        //const products= productService.getProducts({})
        res.render('index', {products,limit,sort,page,
            docs,
            hasPrevPage, 
            hasNextPage,
            prevPage, 
            nextPage,
            pageAct,
            user})
    }
    catch(err){
        logger.error(err)
    }
});

viewsRouter.get('/carts/:cid', async(req, res) => {
    try{
    const cid=req.params.cid
    //const cid="65ca19112dc0eaafade1935e" //Puede servir para testear ya que se usa en views
    // también "65ca2a74be97e0dca5dc3ac8"
    const cart=await cartService.getCartById(cid)
    if (!cart || cid.length<24){
        CustomError.createError({
            name:"Cart not found",
            code:3,
            cause:"The cart does not exist in the current database",
            message:`El carrito ${cid} no existe o no se encuentra en la base de datos actual`
        })
    }
    res.render('cart', { cart})}
    catch(err){
        logger.error(err)
    }
})

viewsRouter.get("/passwordRecovery/:token", async(req, res) => {
    try{
        const token=req.params.token
        const email = checkToken(token).user.email
        const user = await userService.getByMail(email)
        res.status(200).render("changePassword",{user:user})
    }catch(err){
        logger.error(err)
        if (err.name="TokenExpiredError"){
            res.redirect("/passwordRecovery")
        }else{
        logger.error(err)}
    }
})

viewsRouter.get('/passwordRecovery', (req, res)=>{
    res.status(200).render('passwordRecovery')
})

viewsRouter.get('/login', (req, res)=>{
    res.status(200).render('login')
})

viewsRouter.get('/register', (req, res)=>{
    res.status(200).render('register')
})

export {viewsRouter}
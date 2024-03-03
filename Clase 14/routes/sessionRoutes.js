import { Router } from "express";
import { usersModel } from "../dao/models/user.model.js";
import { auth } from "../middleware/authentication.js";
import passport from "passport";

const sessionRouter = Router()
//(req,res,next)=> auth(req,res,next)
sessionRouter.post('/login',(req,res,next)=> auth(req,res,next),passport.authenticate('login', {failureRedirect: '/login'}), async (req, res)=>{
    //const {email, password} = req.body
    // const user = await usersModel.findOne({email, password})

    // if (!user) return res.status(401).redirect("/login")
    
    // req.session.user = {
    //     name: `${user.firstName} ${user.lastName}`,
    //     email: user.email,
    //     role:user.role
    // }
    if (!req.user) return res.status(401).redirect("/login")
    req.session.user = { 
        firstName: req.user.firstName, 
        lastName: req.user.lastName,
        name:`${req.user.firstName} ${req.user.lastName}`,
        role:req.user.role,
        email: req.user.email, 
        id: req.user._id ,
        cartID:req.user.cartID
    }
    res.status(200).redirect("/products")
})

sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email'],failureRedirect:"/githubcallback"}),
async (req, res) => 
{req.session.user = { 
    name:req.user.firstName,
    firstName: req.user.firstName, 
    lastName: req.user.lastName,
    email: req.user.email,
    role:req.user.role,
    id: req.user._id,
    cartID:req.user.cartID
}})

sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'} ),async (req, res) => {
    req.session.user = { 
        name:req.user.firstName,
        firstName: req.user.firstName, 
        lastName: req.user.lastName,
        email: req.user.email,
        role:req.user.role,
        id: req.user._id,
        cartID:req.user.cartID
    }
    res.redirect('/products')
})

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/register'}) ,async (req, res)=>{ 
    try{
    // const {firstName,lastName, email, password } = req.body
    // const exists = await usersModel.findOne({email})

    // if (exists) return res.status(401).send({status: 'error', message: 'El usuario ya existe'})

    // const user = {
    //     firstName,
    //     lastName,
    //     email,
    //     password
    // }
    // let result = await usersModel.create(user)

    if (!req.user) return res.status(401).redirect("/register")
    // const user = { 
    //     firstName: req.user.firstName, 
    //     lastName: req.user.lastName,
    //     email: req.user.email, 
    //     password:req.user.password
    // }
    // await usersModel.create(user)

    res.status(200).redirect("/login")}

    catch(err){
        console.log(err)
    }
})

sessionRouter.post('/logout', async (req, res)=>{
    try{
    req.session.destroy(err => {
        if(err) return res.send({status:'Logout error', message: err})           
    })
    res.status(200).redirect('/login')}
    catch(err)
    {console.log(err)}
})

sessionRouter.get("/current", async (req, res)=>{
    try{
        req.session.user? res.json(req.session.user):res.send("No hay usuario actualmente")
    }
    catch(err){
        console.log(err)
    }
})

export {sessionRouter}
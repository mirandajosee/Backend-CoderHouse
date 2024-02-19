import { Router } from "express";
import { usersModel } from "../dao/models/user.model.js";
import { auth } from "../middleware/authentication.js";

const sessionRouter = Router()

sessionRouter.post('/login',(req,res,next)=> auth(req,res,next), async (req, res)=>{
    const {email, password} = req.body
    const user = await usersModel.findOne({email, password})

    if (!user) return res.status(401).redirect("/login")
    
    req.session.user = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role:user.role
    }

    res.status(200).redirect("/products")
})



sessionRouter.post('/register', async (req, res)=>{ 
    try{
    const {firstName,lastName, email, password } = req.body
    //const role=email.includes("@coder.com")? "admin":"user"
    const exists = await usersModel.findOne({email})

    if (exists) return res.status(401).send({status: 'error', message: 'El usuario ya existe'})

    const user = {
        firstName,
        lastName,
        email,
        password
    }
    let result = await usersModel.create(user)

    res.status(200).json({result})}
    catch(err){
        console.log(err)
    }
})

sessionRouter.get('/logout', async (req, res)=>{
    try{
    req.session.destroy(err => {
        if(err) return res.send({status:'Logout error', message: err})           
    })
    res.status(200).redirect('/login')}
    catch(err)
    {console.log(err)}
})

export {sessionRouter}
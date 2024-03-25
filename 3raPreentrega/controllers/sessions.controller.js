import { UserDTO } from "../dto/user.dto"

export class SessionController{
    constructor(){}

    emailLogin=async (req, res)=>{
        if (!req.user) {return res.status(401).redirect("/login")}
        req.session.user = new UserDTO(req.user)
        res.status(200).redirect("/products")
    }

    githubLogin=async (req, res) => 
    {req.session.user = new UserDTO(req.user)}

    githubRegister=async (req, res) => {
        req.session.user = new UserDTO(req.user)
        res.redirect('/products')
    }
    emailRegister=async (req, res)=>{ 
        try{

        if (!req.user) return res.status(401).redirect("/register")
        res.status(200).redirect("/login")}

        catch(err){
            console.log(err)
        }
    }

    logout=async (req, res)=>{
        try{
        req.session.destroy(err => {
            if(err) return res.send({status:'Logout error', message: err})           
        })
        res.status(200).redirect('/login')}
        catch(err)
        {console.log(err)}
    }

    current=async (req, res)=>{
        try{
            req.session.user? res.json(req.session.user):res.send("No hay usuario actualmente")
        }
        catch(err){
            console.log(err)
        }
    }
}
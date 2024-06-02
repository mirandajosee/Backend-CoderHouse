import { UserDTO } from "../dto/user.dto.js"
import { logger } from "../logger/logger.js"
import { userService } from "../repositories/services.js"
import { sendMail,generateToken,createHash } from "../utils.js"

export class SessionController{
    constructor(){}

    emailLogin=async (req, res)=>{
        if (!req.user) {
            logger.warning("Login incorrecto")
            return res.status(401).redirect("/login")
        }
        req.session.user = new UserDTO(req.user)
        await userService.updateUser(req.session.user.id,{last_connection: (new Date(Date.now())).toUTCString()})
        switch (req.session.user.role) {
            case "premium":
                res.status(200).redirect("/realtimeproducts")
                break
            case "admin":
                res.status(200).redirect("/admin")
                break
            default:
                res.status(200).redirect("/products")
                break
        }
        
    }

    githubLogin=async (req, res) => 
    {req.session.user = new UserDTO(req.user)
    await userService.updateUser(req.session.user.id,{last_connection: (new Date(Date.now())).toUTCString()})
    }

    githubRegister=async (req, res) => {
        req.session.user = new UserDTO(req.user)
        await userService.updateUser(req.session.user.id,{last_connection: (new Date(Date.now())).toUTCString()})
        res.redirect('/products')
    }
    emailRegister=async (req, res)=>{ 
        try{
        if (!req.user) return res.status(401).redirect("/register")
        res.status(200).redirect("/login")
    }

        catch(err){
            logger.error(err||err.message)
        }
    }

    logout=async (req, res)=>{
        try{
        if (req.session.user.role!="admin"){
        await userService.updateUser(req.session.user.id,{last_connection: (new Date(Date.now())).toUTCString()})}
        req.session.destroy(err => {
            if(err) return res.send({status:'Logout error', message: err})           
        })
        
        res.status(200).redirect('/login')}
        catch(err)
        {logger.error(err||err.message)}
    }

    current=async (req, res)=>{
        try{
            req.session.user? res.json(req.session.user):res.send("No hay usuario actualmente")
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    roleUpdate=async (req, res)=>{
        try{
            const uid = req.params.uid
            const user= await userService.getById(uid)
            if(user.role=="user"){
                const docs = await user.documents.map(doc => doc.name)
                if (docs.find(doc =>doc.includes("identificacion"))  &&  
                docs.find(doc =>doc.includes("certificadoDomicilio"))  &&  
                docs.find(doc =>doc.includes("estadoCuenta"))){
                    await userService.updateUser(uid,{role:"premium"})
                    res.status(200).send(`Rol actualizado a premium`)}
                else {
                    res.status(401).send('Faltan documentos para pasar a premium')
                }

            }
            if(user.role=="premium"){
                await userService.updateUser(uid,{role:"user"})
                res.status(200).send(`Rol actualizado a user`)
            }
            
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    passwordRecovery=async (req, res)=>{
        try{
            const email = req.body.email
            const user= await  userService.getByMail(email)
            if(user){
            const token = generateToken({email:email})
            const url = req.protocol + '://' + req.get('host') + "/passwordRecovery/" + token
            await sendMail(
                email,
                "Recupera tu contraseña",
                `<h3>No compartas este link con nadie, sólo dura una hora<h3/>
                <a href=${url}>Recupera tu contraseña aquí<a/>`
                )
            res.status(200).send(`<h1>Se envío un mail a ${user.email}</h1>`)}
            else{
                logger.warning("Mail no encontrado en la base")
                res.redirect("/register")
            }
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    updatePassword=async (req, res)=>{
        try{
            const uid = req.query.uid
            const newPassword = req.body.password
            //const user= await userService.getById(uid)
            await userService.updateUser(uid,{password:createHash(newPassword)})
            res.status(200).send("<h1>Contraseña actualizada</h1>")
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    uploadDocuments = async (req,res)=>{
        try{
            const uid = req.params.uid
            const user = await userService.getById(uid)
            user.documents= user.documents? user.documents : []
            if (!user) {
                return res.status(404).send('User not found')
            }
            if(!req.files){
                return res.status(400).send({status:'error' , error:'No se pudo guardar el archivo'})
            }

            let documents = req.files
            documents.forEach(doc => {
                user.documents.push({
                name: doc.filename,
                reference: doc.path
                })
            })
            await userService.updateUser(uid, user)
            res.status(200).send('<h1>Archivos enviados correctamente</h1>')
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    getUsers=async (req, res)=>{
        try{
            //Pasar a DTO
            const users= (await  userService.get()).map(user => new UserDTO(user))
            res.status(200).send(users)
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    deleteUnactiveUsers=async (req, res)=>{
        try{
            const unactiveUsers= await userService.getUnactiveUsers(1000*60*60*24*2) //1000*60=1min 1min*60=1h 1h*24=1d
            for (let user of unactiveUsers){
                await sendMail(
                    user.email,
                    "Tu cuenta fue borrada por inactividad",
                    `<h3>Hola ${user.firstName}<h3/><br/>
                    <p>Hemos borrado tu cuenta debido a tu inactividad<p/><br/>
                    <p>No te preocupes. Podes registrarte de nuevo y los datos de tus compras siguen intactos.<p/><br/>`
                    )
                await userService.deleteById(user._id)
            }
            res.status(200).send(unactiveUsers)
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

    deleteUser=async (req, res)=>{
        try{
            const uid = req.params.uid
            const user= await userService.deleteById(uid)
            await sendMail(
                    user.email,
                    "Tu cuenta fue borrada",
                    `<h3>Hola ${user.firstName}<h3/><br/>
                    <p>Hemos borrado tu cuenta. Si crees que se trata de un error responde este mail<p/><br/>
                    <p>No te preocupes. Podes registrarte de nuevo y los datos de tus compras siguen intactos.<p/><br/>`
                    )
            res.status(200).send(user)
        }
        catch(err){
            logger.error(err||err.message)
        }
    }

}
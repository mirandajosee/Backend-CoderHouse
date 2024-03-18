import { Router } from "express";
import { auth } from "../middleware/authentication.js";
import passport from "passport";
import { SessionController } from "../controllers/sessions.controller.js";

const {
    emailLogin,
    githubLogin,
    githubRegister,
    emailRegister,
    logout,
    current
} = new SessionController()

const sessionRouter = Router()

sessionRouter.post('/login',(req,res,next)=> auth(req,res,next),passport.authenticate('login', {failureRedirect: '/login'}), emailLogin)
sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email'],failureRedirect:"/githubcallback"}),githubLogin)
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'} ),githubRegister)
sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/register'}) ,emailRegister)
sessionRouter.post('/logout', logout)
sessionRouter.get("/current", current)

export {sessionRouter}
import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import { Strategy as gitHubStrategy} from 'passport-github2'
import { usersModel } from '../dao/models/user.model.js'
import { cartsModel } from '../dao/models/carts.model.js'
import { createHash, isValidPassword } from '../utils.js'


export const initializePassport = () => {
    
    passport.use('register', new localStrategy({
        passReqToCallback: true, // accediendo al req
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {firstName, lastName, email,age} = req.body
        try {
            let  user = await usersModel.findOne({email})
            if (user) return done(null, false)       
            const cart= await cartsModel.create({products:[]})
            const newUser = {
                firstName, 
                lastName,
                email,
                password: createHash(password),
                age,
                cartID: cart._id
            } 
            let result = await usersModel.create(newUser)
            // done funciona como el next
            return done(null, result)
        } catch (error) {
            return done(error)   
        }

    }))

    passport.use('login', new localStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({email: username})
            if (!user) {
                console.log('user no encontrado')
                return done(null, false)
            }
            if (!isValidPassword(password, user.password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new gitHubStrategy({
        clientID:'Iv1.8f720753dc22e47d',
        clientSecret: '7ed060c74d23550378d2c7204eb41b8bb20ae06b',
        callbackURL: 'http://localhost:8080/api/users/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
                let user = await usersModel.findOne({email: profile._json.email})
                if (!user) {
                    const cart= await cartsModel.create({products:[]})
                    let newUser = {
                        firstName: profile._json.name,
                        lastName: profile._json.name,
                        email: profile._json.email,
                        password: '',
                        cartID: cart._id
                    }

                    let result = await usersModel.create(newUser)
                    return done(null, result)
                }
                
                return done(null, user)
        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById({_id: id})
        done(null, user)
    })
}


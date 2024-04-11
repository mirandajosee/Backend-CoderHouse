import {fileURLToPath} from "url"
import {dirname} from "path"
import { genSaltSync,hashSync,compareSync } from "bcrypt"
import { Command } from "commander";
import { default as nodemailer } from "nodemailer"
import { default as twilio } from "twilio";
import { config as dotenvConfig } from "dotenv"
import { logger } from "./logger/logger.js";
import { default as jwt } from "jsonwebtoken"


const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
const commander = new Command()
commander
    .option('--mode <mode>', 'Modo de ejecución (MONGO o FILES)',"MONGO")
    .option('--env <env>', 'Entorno de desarrollo (PROD o DEV)',"PROD")
    .parse()
export const {mode,env}=commander.opts()

switch(env){
    case "PROD": 
        dotenvConfig({path:'./.env.production'})
        break;

    case "DEV": 
        dotenvConfig({path:'./.env.development'})
        break;
    default: 
        dotenvConfig({path:'./.env.production'})
        break;
}



export const createHash = password => hashSync(password, genSaltSync(10))

export const isValidPassword = (password, passwordUser) => {
    return compareSync(password, passwordUser)
}

export const generateToken = user => jwt.sign({user},"a",{expiresIn:"1h"})
export const checkToken = token => jwt.verify(token,"a")


const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASS
    }
})

export const sendMail = async(to, subject, html)=> {try 
    {await transport.sendMail({
    from: 'Mirai ecommerce <'+process.env.MAILING_USER+'>',
    to,
    subject ,
    html
})}
catch(err){logger.error(err)}}

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export const sendSms = ( nombre, apellido,number ) => client.messages.create({
    body: `Gracias por tu compra ${nombre} ${apellido}`,
    from: process.env.TWILIO_NUMBER,
    to: number
})
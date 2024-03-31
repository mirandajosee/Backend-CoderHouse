import {fileURLToPath} from "url"
import {dirname} from "path"
import { genSaltSync,hashSync,compareSync } from "bcrypt"
import { Command } from "commander";
import { default as nodemailer } from "nodemailer"
import { default as twilio } from "twilio";
import { config as dotenvConfig } from "dotenv"
dotenvConfig({path:'./.env.production'})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const commander = new Command()

export default __dirname

export const persistencia = "DB" //"FS" para FyleSystem

export const createHash = password => hashSync(password, genSaltSync(10))

export const isValidPassword = (password, passwordUser) => {
    return compareSync(password, passwordUser)
}



commander
    .option('--mode <mode>', 'Modo de ejecución (MONGO o FILES)',"MONGO")
    .parse()


export const {mode}=commander.opts()

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
catch(err){console.log(err)}}

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export const sendSms = ( nombre, apellido,number ) => client.messages.create({
    body: `Gracias por tu compra ${nombre} ${apellido}`,
    from: process.env.TWILIO_NUMBER,
    to: number
})
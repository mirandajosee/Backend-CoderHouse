import { connect,set } from 'mongoose'
import  {env} from "./utils.js"
import { config as dotenvConfig } from "dotenv"

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

export class MongoSingleton {
    static #instance

    constructor(){
        set('strictQuery', false)
        connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        // .then(() => console.log('conectado a la base de datos'))
        .catch(err => logger.error(err))
    }

    static getInstance(){
        if (this.#instance) {
            console.log("Conectando a base de datos")
            return this.#instance
        }

        this.#instance = new MongoSingleton()
        return this.#instance
    }
}

export const dbConnection =async () => await MongoSingleton.getInstance()
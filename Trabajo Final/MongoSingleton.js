import { connect,set } from 'mongoose'
import  {env} from "./utils.js"
import { config as dotenvConfig } from "dotenv"
import { logger } from './logger/logger.js'

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
        // .then(() => logger.debug('conectado a la base de datos'))
        .catch(err => logger.error(err))
    }

    static getInstance(){
        if (this.#instance) {
            logger.debug("Conectando a base de datos")
            return this.#instance
        }

        this.#instance = new MongoSingleton()
        return this.#instance
    }
}

export const dbConnection =async () => await MongoSingleton.getInstance()
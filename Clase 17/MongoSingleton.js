import { connect,set } from 'mongoose'
import { config as dotenvConfig } from "dotenv"
dotenvConfig({path:'./.env.production'})

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
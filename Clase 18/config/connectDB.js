import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv"
import  {env} from "../utils.js"

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

export const connectBD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}
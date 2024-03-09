import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv"
dotenvConfig({path:'./.env.production'})

export const connectBD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}
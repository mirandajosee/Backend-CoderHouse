import mongoose from "mongoose";

export const connectBD = async () => {
    try {
        await mongoose.connect("mongodb+srv://mirandajosee:MongoDB123@clustercoder.z31q0pz.mongodb.net/")
        // await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}
import { mode } from '../utils.js'
import { dbConnection } from '../MongoSingleton.js'

let ProductDao
let UserDao
let CartDao
let OrderDao

switch (mode) {
    case 'MONGO':

        dbConnection() // 2 llamada a la conexión
        const ProductDaoMongo = (await import('./mongoDao/product.mongo.js')).default
        ProductDao = ProductDaoMongo

        //const UserDaoMongo = (await import('./mongoDao/session.mongo.js')).default
        //UserDao = UserDaoMongo

        //const OrderDaoMongo = (await import('./mongoDao/ticket.mongo.js')).default
        //OrderDao = OrderDaoMongo

        const CartDaoMongo = (await import('./mongoDao/cart.mongo.js')).default
        CartDao = CartDaoMongo
        
        break
    case 'FILES':
        dbConnection()
        ProductDao = (await import('./ProductManager.js')).default
        CartDao = (await import('./CartManager.js')).default
        //UserDao = UserDaoMongo
        //OrderDao = OrderDaoMongo
        break;

    default:
        dbConnection()
        ProductDao =  (await import('./mongoDao/product.mongo.js')).default
        //UserDao = (await import('./mongoDao/session.mongo.js')).default
        //OrderDao = (await import('./mongoDao/ticket.mongo.js')).default
        CartDao = (await import('./mongoDao/cart.mongo.js')).default
        break;
}

export {
    ProductDao,
    UserDao,
    CartDao,
    OrderDao
}
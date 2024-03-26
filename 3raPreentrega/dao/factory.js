import { mode } from '../utils.js'
import { dbConnection } from '../MongoSingleton.js'

let ProductDao
let UserDao
let CartDao
let OrderDao

switch (mode) {
    case 'MONGO':

        dbConnection() // 2 llamada a la conexión
        const ProductDaoMongo = async (import('./mongoDao/product.mongo.js').default)
        ProductDao = ProductDaoMongo

        const UserDaoMongo = async (import('./mongoDao/session.mongo.js')).default
        UserDao = UserDaoMongo

        const OrderDaoMongo = async (import('./mongoDao/ticket.mongo.js')).default
        OrderDao = OrderDaoMongo

        const CartDaoMongo = async (import('./mongoDao/cart.mongo.js').default)
        CartDao = CartDaoMongo
        
        break
    case 'FILES':
        dbConnection()
        ProductDao = async (import('./ProductManager.js')).default
        CartDao = async (import('./CartManager.js')).default
        UserDao = UserDaoMongo
        OrderDao = OrderDaoMongo
        break;

    default:
        dbConnection()
        ProductDao = ProductDaoMongo
        UserDao = UserDaoMongo
        OrderDao = OrderDaoMongo
        CartDao = CartDaoMongo
        break;
}

export {
    ProductDao,
    UserDao,
    CartDao,
    OrderDao
}
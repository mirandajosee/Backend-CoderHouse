import { ProductDao,UserDao,CartDao,OrderDao } from '../dao/factory.js'

const ProductRepositories = (await import('../repositories/product.repositories.js')).default
//const TicketRepositories = (await import('../repositories/tickets.repositories.js')).default
const CartRepositories = (await import('../repositories/cart.repositories.js')).default

const productService = new ProductRepositories(new ProductDao())
const cartService = new CartRepositories(new CartDao())
//const ticketService = new TicketRepositories(new OrderDao())
const userService=new UserDao()

export {
    userService,
    productService,
    cartService,
    //ticketService
}
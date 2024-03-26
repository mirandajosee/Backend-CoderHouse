import { ProductDao,UserDao,CartDao,OrderDao } from '../dao/factory.js'

const ProductRepositories = async (import('../repositories/product.repositories.js')).default
const TicketRepositories = async (import('../repositories/tickets.repositories.js')).default
const CartRepositories = async (import('../repositories/cart.repositories.js')).default

const productService = new ProductRepositories(new ProductDao())
const cartService = new CartRepositories(new CartDao())
const ticketService = new TicketRepositories(new OrderDao())
const userService=new UserDao()

export {
    userService,
    productService,
    cartService,
    ticketService
}
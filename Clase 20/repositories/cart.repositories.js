import { logger } from "../logger/logger.js"

export default class CartRepositories { // UserServices
    constructor(dao){
        this.dao = dao
    }

    async getCartById(cid){
        try{
        return await   this.dao.getCartById(cid)}
        catch(err) {logger.error(err)}
    }

    async getCarts(){
        try{
        return await   this.dao.get()}
        catch(err) {logger.error(err)}
    }

    async createCart(){
        try {
            return await this.dao.createCart()}
        catch (err) {
           return logger.error('Error creating cart'+err);
        }
    }

    async purchaseCart(cid){
        try {
            return await this.dao.purchaseCart(cid)}
        catch (err) {
           return logger.error('Error creating cart'+err);
        }
    }

    async updateCart(cid,newCart){        
        try {
            return await this.dao.updateCart(cid,newCart)
        } catch (error) {
            return logger.error('Error adding product to cart'+error)
        }

    }

    // Delete api/carts/:cid/products/:pid
    async deleteProductFromCart(cid, pid){
        try {
            return await this.dao.deleteItem(cid, pid)
        } catch (error) {
            return logger.error('Error deleting product from cart'+error)
        }
    }

    // vaciar carrito
    async delete(cid){
        try {
            return await this.dao.delete(cid)
        } catch (error) {
            return logger.error('Error deleting cart'+ error)
        }
    }
    async updateProductToCart(cid,pid,quantity){
        try{
            return await this.dao.updateProductToCart(cid,pid,quantity)
        }catch(err)
        {return logger.error('Error deleting cart'+ err)}
    }
    
    async addProductToCart(cartId,productId){
        try{
            return await this.dao.addProductToCart(cartId,productId)
        }
        catch(err){
            logger.error(err)
        }
    }

}
export default class ProductRepositories { // UserServices
    constructor(dao){
        this.dao = dao
    }

    async getCartById(cid){
        try{
        return await   this.dao.getCartById(cid)}
        catch(err) {console.log(err)}
    }

    async getCarts(){
        try{
        return await   this.dao.get()}
        catch(err) {console.log(err)}
    }

    async createCart(){
        try {
            return await this.dao.createCart()}
        catch (err) {
           return new Error('Error creating cart'+err);
        }
    }

    async updateCart(cid,newCart){        
        try {
            return await this.dao.updateCart(cid,newCart)
        } catch (error) {
            return new Error('Error adding product to cart'+error)
        }

    }

    // Delete api/carts/:cid/products/:pid
    async deleteProductFromCart(cid, pid){
        try {
            return await this.dao.deleteItem(cid, pid)
        } catch (error) {
            return new Error('Error deleting product from cart'+error)
        }
    }

    // vaciar carrito
    async delete(cid){
        try {
            return await this.dao.delete(cid)
        } catch (error) {
            return new Error('Error deleting cart'+ error)
        }
    }
    async updateProductToCart(cid,pid,quantity){
        try{
            return await this.dao.updateProductToCart(cid,pid,quantity)
        }catch(err)
        {return new Error('Error deleting cart'+ err)}
    }
    
    async addProductToCart(cartId,productId){
        try{
            return await this.dao.addProductToCart(cartId,productId)
        }
        catch(err){
            console.log(err)
        }
    }

}
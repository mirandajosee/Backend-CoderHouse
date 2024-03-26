export default class ProductRepositories { // UserServices
    constructor(dao){
        this.dao = dao
    }

    async getCartById(cid){
        try{
        return await   this.dao.getCartById(cid)}
        catch(err) {console.log(err)}
    }
}
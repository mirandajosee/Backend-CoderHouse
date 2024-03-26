import { productService } from "../repositories/services.js"

export class ProductController{
    constructor(){}

    getProducts = async (req, res)=> {
        try{
        const {limit=10,pageQuery=1,sort="default"}=req.query
        const config = {limit:limit,pageQuery:pageQuery,sort:sort}
        const result = productService.getProducts(config)
        if (sort=="default"){
            result.prevLink=result.hasPrevPage? req.protocol + '://' + req.get('host')+ "/?limit="+limit+"&page="+result.prevPage : result.hasPrevPage
            result.nextLink=result.hasNextPage? req.protocol + '://' + req.get('host') +"/?limit="+limit+"&page="+result.nextPage : result.hasNextPage}
        else {
                result.prevLink=result.hasPrevPage? req.protocol + '://' + req.get('host')+ "/?limit="+limit+"&page="+result.prevPage+"&sort="+sort : result.hasPrevPage
                result.nextLink=result.hasNextPage? req.protocol + '://' + req.get('host') +"/?limit="+limit+"&page="+result.nextPage+"&sort="+sort : result.hasNextPage}
        res.status(200).json(result)
        }
        catch (err){
            res.status(400)
            console.log(err)
        }}
        
    getProduct = async(req,res) =>{
    try{
    const pid = req.params.pid
    const producto=productService.getProductById(pid)
    producto? res.json(producto) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')
    }
    catch(err){
        console.log(err)
    }
    }

    createProduct= async(req, res) => {
        try{
        const newProduct = req.body
        const result = productService.addProduct(newProduct)
        res.json(result)}
        catch (err){
            console.log(err)
        }
    }

    updateProduct= async (req, res) => {
        try{
            const updatedProduct = req.body
            const id = req.params.pid
            result = productService.updateProduct(id=id,update=updatedProduct)
            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
        }
    }

    deleteProduct= async(req, res) => {
        try{
            const id = req.params.pid
            const result = productService.deleteProduct(id)
            res.json(result)
        }
            catch(err){
                    console.log(err)
                }
    
    }

}
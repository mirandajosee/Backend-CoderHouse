import { productsModel } from "../dao/models/products.model.js"
import { persistencia } from "../utils.js"
import { ProductManager, Product } from "../dao/ProductManager.js"
const PM= new ProductManager()


export class ProductController{
    constructor(){}

    getProducts = async (req, res)=> {
        try{
        const {limit=10,pageQuery=1,sort="default"}=req.query
        const order={"asc":1,"desc":-1}
        
    
        if (persistencia=="FS"){
        limit? res.json(PM.getProducts().slice(0,limit)) : res.json(PM.getProducts())} //Por FileSystem
    
        if (persistencia=="DB"){
            const result =sort=="default"? 
            await productsModel.paginate({}, {limit, page: pageQuery, lean: true}):
            await productsModel.paginate({}, {limit, page: pageQuery, sort: {price: order[sort]}, lean: true})
            result.status="success"
            result.payload=result.docs
            delete result.docs
            if (sort=="default"){
            result.prevLink=result.hasPrevPage? req.protocol + '://' + req.get('host')+ "/?limit="+limit+"&page="+result.prevPage : result.hasPrevPage
            result.nextLink=result.hasNextPage? req.protocol + '://' + req.get('host') +"/?limit="+limit+"&page="+result.nextPage : result.hasNextPage}
            else {
                result.prevLink=result.hasPrevPage? req.protocol + '://' + req.get('host')+ "/?limit="+limit+"&page="+result.prevPage+"&sort="+sort : result.hasPrevPage
                result.nextLink=result.hasNextPage? req.protocol + '://' + req.get('host') +"/?limit="+limit+"&page="+result.nextPage+"&sort="+sort : result.hasNextPage}
            res.status(200).json(
                    result)//Por MongoDB
            }
            //const prods = await productsModel.find({}).lean()
        } 
        catch (err){
            res.status(400)
            console.log(err)
        }}

    getProduct = async(req,res) =>{
    try{
    const pid = Number(req.params.pid)
    const producto=PM.getProductById(pid)
    const productoDB= await productsModel.findOne({_id: pid}).lean()

    if (persistencia=="FS"){
    producto? res.json(producto) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')}

    if (persistencia=="DB"){
    productoDB? res.json(productoDB) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')}
    }
    catch(err){
        console.log(err)
    }
    }

    createProduct= async(req, res) => {
        try{
        const newProduct = req.body
        let result = newProduct
    
        if (persistencia=="FS"){
        PM.addProduct(newProduct)}
    
        if (persistencia=="DB"){
        result= await productsModel.create(newProduct).lean()
        }
        res.json(result)}
    
        catch (err){
            console.log(err)
        }
    }

    updateProduct= async (req, res) => {
        try{
            const updatedProduct = req.body
    
            if (persistencia=="FS")    {
                let id = parseInt(req.params.pid)
                if (isNaN(id)) {
                res.status(400).json({ error: 'Formato de id inválido' })
                return}
                PM.updateProduct(id, updatedProduct)
                res.json(updatedProduct)
            }
            if (persistencia=="DB") {
                let id= req.params.pid
                const result = await productsModel.findOneAndUpdate({_id:id},updatedProduct,{new:true}).lean()
                res.status(200).send(result)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    deleteProduct= async(req, res) => {
        try{
            if (persistencia=="FS"){
                let id = parseInt(req.params.pid)
    
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Formato de id inválido' });
                    return;
                }
    
                PM.deleteProduct(id);
                res.json({ Resultado: 'Producto eliminado correctamente' })}
            
            if (persistencia=="DB"){
                let id = req.params.pid
                const result = await productsModel.findByIdAndDelete({_id:id}).lean()
                res.json(result)
            }
            
            }
                catch(err){
                    console.log(err)
                }
    
    }

}
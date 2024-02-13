import { ProductManager, Product } from "../dao/ProductManager.js"
import {Router} from "express"
import { productsModel } from "../dao/models/products.model.js"
import { persistencia } from "../utils.js"

const PM= new ProductManager()
const productRouter = Router()

productRouter.get('/', async (req, res)=> {
    try{
    const limit = Number(req.query.limit)
    const prods = await productsModel.find({}).lean()

    if (persistencia=="FS"){
    limit? res.json(PM.getProducts().slice(0,limit)) : res.json(PM.getProducts())} //Por FileSystem

    if (persistencia=="DB"){
    limit? res.send(prods.slice(0,limit)) : prods}//Por MongoDB
} 
    catch (err){
        console.log(err)
    }
})

productRouter.get('/:pid', async(req,res) =>{
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
})

productRouter.post('/', async(req, res) => {
    try{
    const newProduct = req.body
    let result = newProduct

    if (persistencia=="FS"){
    PM.addProduct(newProduct)}

    if (persistencia=="DB"){
    result= await productsModel.create(newProduct)
    }
    res.json(result)}

    catch (err){
        console.log(err)
    }
});

productRouter.put('/:pid', async (req, res) => {
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
});

productRouter.delete('/:pid', async(req, res) => {
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

});

export {productRouter}
import { productService } from "../repositories/services.js"
import {faker} from '@faker-js/faker'
import { logger } from "../logger/logger.js"

const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        price: parseInt(faker.commerce.price()),
        stock: parseInt(faker.string.numeric(3)),
        desciption: faker.commerce.productDescription(),
        _id: faker.database.mongodbObjectId(),
        thumbnail: [faker.image.url()],
        code:faker.string.alphanumeric(20)
    }
}

export class ProductController{
    constructor(){}

    getPageProducts = async (req, res)=> {
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
            logger.error(err)
        }}
        
    getProduct = async(req,res) =>{
    try{
    const pid = req.params.pid
    const producto=productService.getProductById(pid)
    producto? res.json(producto) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')
    }
    catch(err){
        logger.error(err)
    }
    }

    getProducts = async(req,res) =>{
        try{
        const products=productService.getProducts()
        res.json(products)
        }
        catch(err){
            logger.error(err)
        }
        }

    createProduct= async(req, res) => {
        try{
        const newProduct = req.body
        if (!newProduct.title || !newProduct.code || !newProduct.description || !newProduct.price || !newProduct.stock ){
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were missing or had a wrong type",
                code:"2",
                message:`Dato faltante o de tipo incorrecto, ver formato correcto y corrregir, se recibió ${newProduct}`
            })
        }
        const result = productService.addProduct(newProduct)
        res.json(result)}
        catch (err){
            logger.error(err)
        }
    }

    updateProduct= async (req, res) => {
        try{
            const updatedProduct = req.body
            const id = req.params.pid
            if (!id || !updatedProduct ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió id=${typeof(id)},updateProduct=${typeof(updatedProduct)}}`
                })
            }
            result = productService.updateProduct(id=id,update=updatedProduct)
            res.status(200).send(result)
        }
        catch(err){
            logger.error(err)
        }
    }

    deleteProduct= async(req, res) => {
        try{
            const id = req.params.pid
            const result = productService.deleteProduct(id)
            res.json(result)
        }
            catch(err){
                    logger.error(err)
                }
    
    }

    mockingProducts = async (req,res) =>
    {
        try{
            const {quantity=100}=parseInt(req.query)
            let products = []
            if (!quantity ){
                CustomError.createError({
                    name:"Invalid or missing params",
                    cause:"Needed params were missing or had a wrong type",
                    code:"2",
                    message:`Dato faltante o de tipo incorrecto\n Se recibió quantity=${typeof(quantity)}`
                })
            }
            for (let i = 0; i < quantity; i++) {
                products.push(generateProducts())
            }
            res.send(products)
        }
        catch(err){
            logger.error(err)
        }
    }

}
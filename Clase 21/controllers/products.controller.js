import { productService } from "../repositories/services.js"
import {faker} from '@faker-js/faker'
import { logger } from "../logger/logger.js"
import { CustomError } from "../errors/CustomError.js"

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
        const result = await productService.getProducts(config)
        if (sort=="default"){
            result.prevLink=result.hasPrevPage? req.protocol + '://' + req.get('host')+ "/Products?limit="+limit+"&page="+result.prevPage : result.hasPrevPage
            result.nextLink=result.hasNextPage? req.protocol + '://' + req.get('host') +"/Products?limit="+limit+"&page="+result.nextPage : result.hasNextPage}
        else {
                result.prevLink=result.hasPrevPage? req.protocol + '://' + req.get('host')+ "/Productslimit="+limit+"&page="+result.prevPage+"&sort="+sort : result.hasPrevPage
                result.nextLink=result.hasNextPage? req.protocol + '://' + req.get('host') +"/Products?limit="+limit+"&page="+result.nextPage+"&sort="+sort : result.hasNextPage}
        res.status(200).json(result)
        }
        catch (err){
            logger.info("error de controller")
            res.status(400)
            logger.error(err)
        }}
        
    getProduct = async(req,res) =>{
    try{
    const pid = req.params.pid
    const producto=await productService.getProductById(pid)
    producto? res.json(producto) : CustomError.createError({
        name:"Product not found",
        code:3,
        cause:"The product does not exist in the current database",
        message:`El producto ${id} no existe o no se encuentra en la base de datos actual`
    })
    }
    catch(err){
        logger.info("error de controller")
        logger.error(err)
    }
    }

    getProducts = async(req,res) =>{
        try{
        const products=await productService.getProducts()
        res.json(products)
        }
        catch(err){
            logger.info("error de controller")
            logger.error(err)
        }
        }

    createProduct= async(req, res) => {
        try{
        let newProduct = req.body
        if (req.session.user.role=="admin"){
            newProduct.owner="admin"
        }else{
            newProduct.owner=req.session.user.email
        }
        if (!newProduct.title || !newProduct.code || !newProduct.description || !newProduct.price || !newProduct.stock ){
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were missing or had a wrong type",
                code:"2",
                message:`Dato faltante o de tipo incorrecto, ver formato correcto y corrregir, se recibió ${newProduct}`
            })
        }
        const result = await productService.addProduct(newProduct)
        res.json(result)}
        catch (err){
            logger.info("error de controller")
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
            const product = await productService.getProductById(id)
            if (product.owner == req.session.user.email || req.session.user.role=="admin"){
                const result = await productService.updateProduct(id,updatedProduct)
                res.status(200).send(result)
                return
            }
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were wrong",
                code:"2",
                message:`Dato incorrecto\n Se recibió user=${req.session.user.email},no puedes actualizar un producto que no es tuyo}`
            })
            
        }
        catch(err){
            logger.info("error de controller")
            logger.error(err)
        }
    }

    deleteProduct= async(req, res) => {
        try{
            const id = req.params.pid
            const product = await productService.getProductById(id)
            if (product.owner == req.session.user.email || req.session.user.role=="admin"){
                const result = await productService.deleteProduct(id)
                res.status(200).send(result)
                return
            }
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were wrong",
                code:"2",
                message:`Dato incorrecto\n Se recibió user=${req.session.user.email},no puedes borrar un product que no es tuyo}`
            })
        }
            catch(err){
                logger.info("error de controller")
                logger.error(err)
                }
    
    }
    
    mockingProducts = async (req,res) =>
    {
        try{
            const quantity=parseInt(req.query.quantity) || 100
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
            logger.info("error de controller")
            logger.error(err)
        }
    }

}
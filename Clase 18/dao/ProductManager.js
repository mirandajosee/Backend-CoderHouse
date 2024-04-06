//const fs = require("fs")
//const { promises, existsSync} = require('fs')
import fs from "node:fs"
import { promises, existsSync} from "node:fs"
import { CustomError } from "../errors/CustomError"
import {logger} from '../logger.js'

export default class ProductManager {
    constructor(){
        this.path="./products.json"
        this.readFileOrCreateNewOne()
    }

    readFileOrCreateNewOne = ()=> {
        existsSync(this.path)? fs.readFileSync(this.path) : fs.writeFileSync(this.path, "[]")
    }

    getProducts = (Config) => {
            const dataJson = Config.limit? JSON.parse(fs.readFileSync(this.path, "utf-8")).slice(0,Config.limit) : JSON.parse(fs.readFileSync(this.path, "utf-8"))
            return dataJson
        } 

    

    addProduct = (product) => {
        let tmb=[]
        product.thumbnail? tmb.push(product.thumbnail): []
        product.thumbnail=product.thumbnail? tmb:[]
        product.price=Number(product.price)
        product.stock=Number(product.stock)
        //product.thumbnail=Array.isArray(product.thumbnail)? product.thumbnail:[]
        if (typeof (product.title)==="string" &&
            typeof (product.description)==="string" &&
            !isNaN(product.price) &&
            typeof (product.code)==="string" &&
            !isNaN(product.stock)){
            let productos= this.getProducts()
            if (productos.find((prod)=>prod.code==product.code)){
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product code already exist in the current database",
                    message:`El producto con código ${product.code} ya existe en la base de datos actual`
                })
            }else {
            product.status = product.status===false? product.status : true
            const lastId=productos.slice(-1)[0]? Math.max(productos.length , productos.slice(-1)[0].id)+1 : 1
            product.id=lastId
            productos.push(product)
            fs.writeFileSync(this.path,JSON.stringify(productos,null,2),"utf-8")
            return product
            }
        }else {
            CustomError.createError({
                name:"Invalid or missing params",
                cause:"Needed params were missing or had a wrong type",
                code:"2",
                message:`Se ingresó un producto incorrecto, verifique los campos obligatorios\n Se recibió product=${(product)}`
            })}
    }


    getProductById = (id) => {
        id=Number(id)
        const data= this.getProducts()
        const productById = data.find((prod)=>prod.id==id)
        if(productById){
            return productById
        }else{
            CustomError.createError({
                name:"Product not found",
                code:3,
                cause:"The product does not exist in the current database",
                message:`El producto ${id} no existe o no se encuentra en la base de datos actual`
            })
            return}
    }

    updateProduct = (id,update) => {
            id=parseInt(id)
            const data= this.getProducts()
            let  producto = data.find((prod)=>prod.id==id)
            if (producto){
                producto = {...producto,...update,...{id:id}}
                producto.price=Number(producto.price)
                producto.stock=Number(producto.stock)
                if (typeof (producto.title)==="string" &&
                typeof (producto.description)==="string" &&
                !isNaN(producto.price) &&
                Array.isArray(producto.thumbnail) &&
                typeof (producto.code)==="string" &&
                !isNaN(producto.stock)){
                        data[data.findIndex(prod => prod.id==id)]=producto
                        fs.writeFileSync(this.path,JSON.stringify(data,null,2),"utf-8")
                        return console.log("Producto actualizado exitosamente")
                    }else {
                        CustomError.createError({
                            name:"Invalid or missing params",
                            cause:"Needed params were missing or had a wrong type",
                            code:"2",
                            message:`Se ingresó un producto incorrecto, verifique los campos obligatorios\n Se recibió update=${(update)}`
                        })
                    }

            } else {
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product does not exist in the current database",
                    message:`El producto ${id} no existe o no se encuentra en la base de datos actual`
                })
                return
            }
    }

    deleteProduct = (id) => {
        try{
            id=parseInt(id)
            const data = this.getProducts()
            const productoId = data.findIndex(prod => prod.id==id)
            if (productoId!=-1){
                data.splice(productoId,1)
                fs.writeFileSync(this.path,JSON.stringify(data,null,2),"utf-8")
                console.log("Elemento borrado exitosamente")
                return this.getProducts()
            } else {
                CustomError.createError({
                    name:"Product not found",
                    code:3,
                    cause:"The product does not exist in the current database",
                    message:`El producto ${id} no existe o no se encuentra en la base de datos actual`
                })
                return
            }
            
        } catch (err) {
            logger.error(err)
        }
    }
}

export class Product {
    constructor(title,description,price,thumbnail,code,stock,status=true){
        this.title=title
        this.thumbnail=thumbnail
        this.price=price
        this.stock=stock
        this.code=code
        this.description=description
        this.status=status
    }
}



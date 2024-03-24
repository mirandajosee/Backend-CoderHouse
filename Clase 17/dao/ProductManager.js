//const fs = require("fs")
//const { promises, existsSync} = require('fs')
import fs, { stat } from "node:fs"
import { promises, existsSync} from "node:fs"

export class ProductManager {
    constructor(){
        this.path="./products.json"
        this.readFileOrCreateNewOne()
    }

    readFileOrCreateNewOne = ()=> {
        existsSync(this.path)? fs.readFileSync(this.path) : fs.writeFileSync(this.path, "[]")
    }

    getProducts = () => {
            const dataJson = fs.readFileSync(this.path, "utf-8")
            return JSON.parse(dataJson)
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
                console.log("Este producto tiene un código ya utilizado")
            }else {
            product.status = product.status===false? product.status : true
            const lastId=productos.slice(-1)[0]? Math.max(productos.length , productos.slice(-1)[0].id)+1 : 1
            product.id=lastId
            productos.push(product)
            fs.writeFileSync(this.path,JSON.stringify(productos,null,2),"utf-8")
            }
        }else {
        console.log("Se ingresó un producto incorrecto, verifique los campos obligatorios")}
    }


    getProductById = (id) => {
        const data= this.getProducts()
        const productById = data.find((prod)=>prod.id==id)
        if(productById){
            return productById
        }else{
            console.log("Id not found")
            return}
    }

    updateProduct = (id,update) => {
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
                        console.log("Se ingresó un producto incorrecto, verifique los campos obligatorios")
                    }

            } else {
            return console.log("Id not found")
            }
    }

    deleteProduct = (id) => {
        try{
            const data = this.getProducts()
            const productoId = data.findIndex(prod => prod.id==id)
            if (productoId!=-1){
                data.splice(productoId,1)
                fs.writeFileSync(this.path,JSON.stringify(data,null,2),"utf-8")
                return console.log("Elemento borrado exitosamente")
            } else {
                return console.log("Id not found")
            }
            
        } catch (err) {
            console.log(err)
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



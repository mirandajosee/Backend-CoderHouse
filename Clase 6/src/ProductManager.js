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
        product.thumbnail=Array.isArray(product.thumbnail)? product.thumbnail:[]
        if (typeof (product.title)==="string" &&
            typeof (product.description)==="string" &&
            !isNaN(product.price) &&
            !isNaN(product.code) &&
            !isNaN(product.stock)){
            let productos= this.getProducts()
            if (productos.find((prod)=>prod.code==product.code)){
                console.log("Este producto tiene un código ya utilizado")
            }else {
            product.status = product.status===false? product.status : true
            const lastId=productos.slice(-1)[0]? Math.max(productos.length , productos.slice(-1)[0].id)+1 : 1
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
                if (typeof (producto.title)==="string" &&
                typeof (producto.description)==="string" &&
                !isNaN(producto.price) &&
                Array.isArray(producto.thumbnail) &&
                !isNaN(producto.code) &&
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

//Código de testeo
/* 
const product1=new Product("Remera Chainsaw Man","Producto original",420,"Enlace",123,6900)
const product2=new Product("Producto repetido","Code ya utilizado",912,"Enlace",123,700)
const product3=new Product("Drone","Drone importado de China",77,"Enlace",12,700)

 PM.addProduct(product2)
console.log(PM.getProductById(0))
PM.addProduct(product3)
console.log(PM.getProducts)
PM.deleteProduct(2)
PM.updateProduct(1,product3)
PM.addProduct(product1)
console.log(PM.getProducts)
 */


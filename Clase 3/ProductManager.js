const { promises: fs } = require('fs')

class ProductManager {
    constructor(){
        this.path="./products.json"
        this.readFileOrCreateNewOne()
    }
    readFileOrCreateNewOne = async()=> {
        try {
          await fs.readFile(this.path, "utf-8");
        } catch (error) {
          error.code === "ENOENT"? this.createEmptyFile() : console.log(error)
        }
      }

    createEmptyFile= async() => {
        fs.writeFile(this.path, "[]", (error) => {
          error? console.log(error): console.log(error)
        });
      }
    
    getProducts = async() => {
        try{
            const dataJson = await fs.readFile(this.path)
            return JSON.parse(dataJson)
        } catch (error) {
            console.log(error)
        }
    }

    

    addProduct = async (product) => {
        try {
        let productos= await this.getProducts()
        if (product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock){
            
            if (productos.find((prod)=>prod.code==product.code)){
                console.log("Este producto tiene un código ya utilizado")
            }else {
            product.id= productos.lenght+1
            productos.push(product)
            fs.writeFile(this.path,JSON.stringify(productos,null,2),"utf-8")
            }
            
        }else {console.log("Se ingresó un producto incorrecto, verifique los campos obligatorios")}
    } catch(err) {
        console.log(err)
    }
    }
    getProductById = async (id) => {
        try{
        const productos = await this.getProducts()
        const productById= productos.find((prod)=>prod.id==id)
        if(productById){
            return productById
        }else{
            console.log("Not found")
            return}
        }catch (err) {
            console.log(err)
        }
    }

    updateProduct = async (id,update) => {
        try{
            let data= await this.getProducts()
            let producto = data.find((prod)=>prod.id==id)
            if (producto){
                producto = {...producto,...update,...{id:id}}
                if (producto.title &&
                    producto.description &&
                    producto.price &&
                    producto.thumbnail &&
                    producto.code &&
                    producto.stock){
                        data[data.findIndex(prod => prod.id==id)]=producto
                        await fs.writeFile(this.path,JSON.stringify(data,null,2),"utf-8")
                        return console.log("Producto actualizado exitosamente")
                    }else {
                        console.log("Se ingresó un producto incorrecto, verifique los campos obligatorios")
                    }

            } else {
            return console.log("Id not found")
            }

        } catch (err) {
            console.log(err)
        }
    }

    deleteProduct = async (id) => {
        try{
            const data = await this.getProducts()
            const producto = data.find((prod)=>prod.id==id)
            if (producto){
                let indexToDel = data.findIndex(prod => prod.id==id)
                data.splice(indexToDel,1)
                await fs.writeFile(this.path,JSON.stringify(data,null,2),"utf-8")
                return console.log("Elemento borrado exitosamente")
            } else {
                return console.log("Id not found")
            }
            
        } catch (err) {
            console.log(err)
        }
    }


}

class Product {
    constructor(title,description,price,thumbnail,code,stock){
        this.title=title
        this.thumbnail=thumbnail
        this.price=price
        this.stock=stock
        this.code=code
        this.description=description
    }
}

const PM = new ProductManager()
//Código de testeo

/* const product1=new Product("Producto 1","Producto nuevo",420,"Enlace",123,6900)
const product2=new Product("Producto 2","Producto fachero",912,"Enlace",1234,700)
const product3=new Product("P3","Producto fachero",77,"Enlace",12,700)
console.log(PM.getProducts())
console.log(PM.getProductById(0))
PM.addProduct(product2) */

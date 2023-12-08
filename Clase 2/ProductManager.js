class ProductManager {
    constructor(){
        this.products = []
    }

    getProducts = () => {
        return this.products
    }

    static lastId = 0

    addProduct = (product) => {

        if (product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock){
            
            if (this.products.find((prod)=>prod.code==product.code)){
                console.log("Este producto tiene un código ya utilizado")
            }else {
            product.id=ProductManager.lastId
            ProductManager.lastId++
            this.products.push(product)
            }
            
        }else {console.log("Se ingresó un producto incorrecto, verifique los campos obligatorios")}
    }
    getProductById = (id) => {
        let productById= this.products.find((prod)=>prod.id==id)
        if(productById){
            return productById
        }else{
            console.log("Not found")
            return}
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
const product2=new Product("Producto 2","Producto fachero",912,"Enlace",123,700)
const product3=new Product("","Producto fachero",77,"Enlace",12,700)
console.log(PM.getProducts())
console.log(PM.getProductById(69))
PM.addProduct(product1)
console.log(PM.getProducts())
console.log(PM.getProductById(0))
PM.addProduct(product2)
console.log(PM.getProducts())
PM.addProduct(product3)
console.log(PM.getProducts())
console.log(PM.getProductById(1))
console.log(PM.getProductById(77))
PM.addProduct({title:"ProductoTrucho"})
console.log(PM.getProducts()) */
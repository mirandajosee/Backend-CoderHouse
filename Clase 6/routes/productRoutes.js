import { ProductManager, Product } from "../dao/ProductManager.js"
import {Router} from "express"

const PM= new ProductManager()
const productRouter = Router()

productRouter.get('/', (req, res)=> {
    const limit = Number(req.query.limit)
    limit? res.json(PM.getProducts().slice(0,limit)) : res.json(PM.getProducts())
})

productRouter.get('/:pid',(req,res) =>{
    const pid = Number(req.params.pid)
    const producto=PM.getProductById(pid)
    producto? res.json(producto) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')
})

productRouter.post('/', (req, res) => {
    const newProduct = req.body
    PM.addProduct(newProduct)
    res.json(newProduct)
});

productRouter.put('/:pid', (req, res) => {
    const updatedProduct = req.body
    let id = parseInt(req.params.pid)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Formato de id inválido' })
        return;
    }

    PM.updateProduct(id, updatedProduct);
    res.json(updatedProduct)
});

productRouter.delete('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)

    if (isNaN(id)) {
        res.status(400).json({ error: 'Formato de id inválido' });
        return;
    }

    PM.deleteProduct(id);
    res.json({ Resultado: 'Producto eliminado correctamente' })

});

export {productRouter}
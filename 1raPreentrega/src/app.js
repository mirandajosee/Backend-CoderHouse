import {ProductManager,Product}  from "./ProductManager.js"
import express from "express"

const PM=new ProductManager()
const app = express()

app.get('/products', (req, res)=> {
    const limit = Number(req.query.limit)
    limit? res.json(PM.getProducts().slice(0,limit)) : res.json(PM.getProducts())
})

app.get('/products/:pid',(req,res) =>{
    const pid = Number(req.params.pid)
    const producto=PM.getProductById(pid)
    producto? res.json(producto) : res.status(404).send('<h1>Error 404: El producto no existe</h1>')
})

app.listen(8080, ()=>{
    console.log('Escuchando en el puerto 8080')
})
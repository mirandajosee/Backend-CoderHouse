import supertest from "supertest";
import {expect} from "chai"
import { dbConnection } from "../MongoSingleton.js";
import { productsModel } from "../dao/models/products.model.js";


const request = supertest.agent('http://localhost:8080'); //Se deja así pues sólo se usaría en desarrollo, no en productivo

describe('API de productos', () => {
  let productId;

  const productMock = {
    title: "Producto de testing",
    description: "Producto para testear el correcto funcionamiento",
    price: 125 ,
    thumbnail: "producto.jpg",
    code: "PC69420E91218",
    stock: 25,
    status: true
  }

  const updatedProductMock = {
    title: 'Balón de fútbol',
    description: "Producto importado desde Madrid",
    price: 91218
  };

  const usuarioTesting = {
    email: "testing@gmail.com",
    password: "testing123"
  }

  //Se hace un login ya que es necesario tener permisos premium para algunas cosas a testear
  before(
    async function(){
        await request.post('/api/users/login').send(usuarioTesting)
        return
    }
  )

  // Test para la ruta POST '/'
  it('Test crear un nuevo producto', async () => {
    const res = await request.post('/api/products').send(productMock);
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('title')
    expect(res.body).to.have.property('_id')
    productId = res.body._id
  });

  // Test para la ruta GET '/'
  it('Test obtener todos los productos', async () => {
    const res = await request.get('/api/products')
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('array')
    expect(res.body[0]).to.be.an('object')
    expect(res.body[0]).to.be.have.property('_id')
  });

  // Test para la ruta GET '/:pid'
  it('Test obtener el producto creado', async () => {
    const res = await request.get(`/api/products/${productId}`)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.have.property('_id')
    expect(res.body).to.have.property('title', productMock.title)
    expect(res.body).to.have.property('price', productMock.price)
  });

  // Test para la ruta PUT '/:pid'
  it('Test actualizar el producto creado', async () => {
    const res = await request.put(`/api/products/${productId}`).send(updatedProductMock)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('title', updatedProductMock.title)
    expect(res.body).to.have.property('description', updatedProductMock.description)
    expect(res.body).to.have.property('price', updatedProductMock.price)
  });

  // Test para la ruta DELETE '/:pid' (Notar que no borra el producto, sino que cambia su status)
  it('Test eliminar el producto creado', async () => {
    const res = await request.delete(`/api/products/${productId}`)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.have.property('status', false)
  })

  // Se borra de la base de datos el dato testeado
  after(async function(){
    await dbConnection()
    await productsModel.findByIdAndDelete(productId)
    return
  }
  )

})

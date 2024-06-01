import supertest from "supertest";
import {expect} from "chai"


const request = supertest.agent('http://localhost:8080'); //Se deja así pues sólo se usaría en desarrollo, no en productivo

describe('API de carritos', () => {
  const productId="65bf2577eb4489fe2f045df4"
  const cartId="662c55c1ab82df0e29cbe73e"
  
  const updatedCartMock = [
    {
      "product": "65bf2577eb4489fe2f045def",
      "quantity": 2
    },
    {
      "product": "65bf2577eb4489fe2f045df4",
      "quantity": 1
    }
  ]

  const usuarioTesting = {
    email: "testing@gmail.com",
    password: "testing123"
  }

  //Se hace un login ya que es necesario tener permisos premium para algunas cosas a testear
  before(
    async function(){
        await request.post('/api/users/login').send(usuarioTesting)
    }
  )

  // Test para la ruta GET '/'
  it('Test obtener todos los carritos', async () => {
    const res = await request.get('/api/carts')
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('array')
    expect(res.body[0]).to.be.an('object')
    expect(res.body[0]).to.be.have.property('_id')
    expect(res.body[0].products).to.be.an("array")
  })

  // Test para la ruta GET '/:cid'
  it('Test obtener un carrito', async () => {
    const res = await request.get(`/api/carts/${cartId}`)
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.have.property('_id')
    expect(res.body).to.have.property('products')
    expect(res.body.products).to.be.an("array")
  });

  // Test para la ruta PUT '/:cid'
  it('Test actualizar el carrito', async () => {
    const res = await request.put(`/api/carts/${cartId}`).send(updatedCartMock)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('products')
    expect(res.body.products).to.be.an("array")
    expect(res.body.products).to.deep.equal(updatedCartMock)
    expect(res.body.products[0]).to.have.property('quantity',2)
    expect(res.body.products[1]).to.have.property('quantity',1)
  })

  // Test para la ruta PUT '/:cid/products/:pid'
  it('Test actualizar la cantidad de un producto en carrito', async () => {
    const res = await request.put(`/api/carts/${cartId}/products/${productId}`).send({quantity:3})
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('products')
    expect(res.body.products).to.be.an("array")
    expect(res.body.products[0]).to.have.property('quantity',2)
    expect(res.body.products[1]).to.have.property('quantity',3)
  })

  // Test para la ruta DELETE '/:pid' (Notar que no borra el producto, sino que cambia su status)
  it('Test vaciar el carrito', async () => {
    const res = await request.delete(`/api/carts/${cartId}`)
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('_id')
    expect(res.body).to.have.property('products')
    expect(res.body.products).to.be.eql([])
  })

  // Se asegura dejar el cart vacío tras las pruebas, aunque debería ser suficiente con el delete anterior
  after(async function(){
    const res = await request.put(`/api/carts/${cartId}`).send([])
    expect(res.statusCode).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('products')
    expect(res.body.products).to.be.eql([])
  }
  )

})

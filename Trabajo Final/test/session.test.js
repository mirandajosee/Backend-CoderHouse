import supertest from "supertest";
import {expect} from "chai"
import { dbConnection } from "../MongoSingleton.js"
import { usersModel } from "../dao/models/user.model.js";


const request = supertest.agent('http://localhost:8080') //Se deja así pues sólo se usaría en desarrollo, no en productivo

describe('API de session', () => {

  const usuarioTesting = {
    email: "testingUser@gmail.com",
    password: "testing123",
    firstName:"Usuario",
    lastName:"Prueba",
    age:24
  }

  describe('Testing Router Sessions', () => {
    describe('Test de sessions', () => {
        let cookie
        it('POST /api/sessions/register debe crear un usuario correctamente', async function () {
            const response = await request.post('/api/users/register').send(usuarioTesting)
            expect(response.statusCode).to.equal(302)
            expect(response.text).to.equal("Found. Redirecting to /login")
            expect(response.headers.location).to.equal("/login")
        }).timeout(5000)

        it('POST /api/sessions/login debe loguear al usuario y devolver una cookie', async function () {
            const response = await request.post('/api/users/login').send(usuarioTesting)
            const cookieResult = response.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            }
            expect(cookie.name).to.be.ok.and.eql('connect.sid');
            expect(cookie.value).to.be.ok
            expect(response.statusCode).to.equal(302)
            expect(response.headers.location).to.equal("/products")
        }).timeout(5000)

        it('GET /api/sessions/current debe devolver el usuario', async function () {
            const response = await request.get('/api/users/current')
            expect(response.statusCode).to.equal(200)
            expect(response.body.firstName).to.equal(usuarioTesting.firstName)
            expect(response.body.lastName).to.equal(usuarioTesting.lastName)
            expect(response.body.email).to.equal(usuarioTesting.email)
            expect(response.body.role).to.equal("user")
        }).timeout(5000)

        it('POST api/users/logout debe sacar al usuario', async function () {
            const response = await request.post('/api/users/logout')
            const cookieResult = response.headers['set-cookie']
            expect(response.statusCode).to.equal(302)
            expect(response.headers.location).to.be.equal("/login")
            expect(cookieResult).to.not.be.ok
        }).timeout(5000)

        it('GET /api/sessions/current NO debe devolver el usuario', async function () {
            const response = await request.get('/api/users/current')
            expect(response.statusCode).to.equal(200)
            expect(response.body.email).to.not.be.ok
            expect(response.body.email).to.not.be.equal(usuarioTesting.email)
            expect(response.text).to.equal("No hay usuario actualmente")
        }).timeout(5000)


        //Borra el usuario creado de la base de datos después de testear
        after(async function(){
            await dbConnection()
            await usersModel.findOneAndDelete({email:usuarioTesting.email})
            return
          })
    })

})
})
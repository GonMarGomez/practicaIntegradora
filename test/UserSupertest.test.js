import chai from 'chai';
import supertest from 'supertest';
import { createHash } from "../src/utils/funcionUtil.js";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

 describe('Test Registro de Usuario', () => {
   it('Debe registrar un usuario correctamente', async () => {
     const newUser = {
       first_name: 'Test',
       last_name: 'Coder',
       email: 'coder@test.com',
       age: 25,
       password: 'password123',
     };

     const response = await requester.post('/api/sessions/register').send(newUser);

     expect(response.status).to.equal(302);
     expect(response.headers).to.have.property('location').equal('/login');
   });
 });

 describe('Test Inicio de Sesion', () => {
    
     it('Debe iniciar sesion correctamente', async () => {
       const loginResponse = await requester.post('/api/sessions/login').send({
         email: 'coder@test.com',
         password: 'password123', 
       });
       expect(loginResponse.status).to.equal(302);   
       expect(loginResponse.header.location).to.equal('/products');
     });

describe('Test inicio de sesion fallido', () => {
    it('Debe redirigir al usuario si las credenciales son invalidas', async () => {
      const invalidUser = {
        email: 'coder@test.com',
        password: 'invalidpassword',
      };
  
      const response = await requester
        .post('/api/sessions/login')
        .send(invalidUser);
  
 
      expect(response.status).to.equal(302); 
    });
  });
});
  

  

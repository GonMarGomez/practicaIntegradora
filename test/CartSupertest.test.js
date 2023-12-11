import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Test obtener carrito por ID', () => {
    it('El endpoint GET /api/cart/:cid debe responder con el carrito correspondiente al ID', async () => {
      const cartIdToSearch = '6500ce7544cf25b6777c5666';
      const response = await requester.get(`/api/cart/${cartIdToSearch}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('cartProducts');
      const cart = response.body.cartProducts;
  

      expect(cart).to.have.property('_id').equal(cartIdToSearch);
      expect(cart).to.have.property('products').to.be.an('array');
      expect(cart.products.length).to.be.greaterThan(0);
  
      const product = cart.products[0];
      expect(product).to.have.property('_id');
      expect(product).to.have.property('product');
      expect(product).to.have.property('quantity').to.be.greaterThan(0);
    });
  
    it('El endpoint GET /api/cart/:cid debe responder con 404 si el ID no existe', async () => {
      const nonExistentCartId = 'id_inexistente';
      const response = await requester.get(`/api/cart/${nonExistentCartId}`);
  
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('error').equal('Carrito no encontrado');
    });
  });
  
  
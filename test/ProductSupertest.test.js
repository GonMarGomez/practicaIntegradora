import chai from 'chai'
import supertest from 'supertest';

const expect = chai.expect
const requester = supertest('http://localhost:8080');

describe('Testing GameShop-Products', ()=>{

describe('Test get Products', ()=>{
    it('El endpoint GET /api/product debe responder con un array de productos', async ()=>{ 
    const {
        statusCode,
        ok,
        _body
    } = await requester.get('/api/product')
        expect(_body.payload.payload).to.be.an('array');
    });
    
});
describe('Test get Product by ID', () => {
    it('El endpoint GET /api/product/:pid debe responder con el producto correspondiente al ID', async () => {
      const productId = '64fdcf91b61c388dfbef777b';

      const { statusCode, body } = await requester.get(`/api/product/${productId}`);

  
      expect(statusCode).to.equal(200);
      expect(body).to.have.property('status').equal('success');
      expect(body).to.have.property('payload').to.be.an('array').that.is.not.empty;
      
  
      const firstProduct = body.payload[0];
      expect(firstProduct).to.have.property('_id').equal(productId);

      expect(firstProduct).to.have.property('title');
      expect(firstProduct).to.have.property('description');
      expect(firstProduct).to.have.property('price');
    })
});
describe('Test agregar productos al Carrito', () => {
    it('El endpoint POST /api/cart/:cid/product/:pid debe agregar un producto al carrito', async () => {
      const cartId = '6500ce7544cf25b6777c5666';
      const productIdToAdd = '64fdcf91b61c388dfbef777b';
  
      const response = await requester.post(`/api/cart/${cartId}/product/${productIdToAdd}`);
      
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('cart');
      
      const cart = response.body.cart;
      expect(cart).to.have.property('_id').equal(cartId);
      expect(cart).to.have.property('products').to.be.an('array');

  
      const addedProduct = cart.products.find(product => product.product === productIdToAdd);
      expect(addedProduct).to.exist;
      expect(addedProduct).to.have.property('_id');
      expect(addedProduct).to.have.property('product').equal(productIdToAdd);
    });
    });
  });
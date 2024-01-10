import { Router } from 'express';
import CartController from '../dao/controllers/CartController.js';
import { productController } from '../dao/controllers/productController.js';
import TicketController from '../dao/controllers/ticketsController.js';

const cartRouter = Router();

const cartController = new CartController();
const productDBController = new productController();
const ticketController = new TicketController();
cartRouter.post('/', async (req, res) => {
    const cart = await cartController.createCart();

    res.send({ cart });
});

cartRouter.get('/:cid', async (req, res) => {
    const cartProducts = await cartController.getCartById(req.params.cid);
    if (!cartProducts) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.send({cartProducts});
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        let cart = await cartController.getCartById(cartId);

        if (!cart) {
            const newCart = await cartController.createCart();
            cart = newCart.cart;
        }
        const product = await productDBController.getProductById(productId);

        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        }

        await cartController.addProductToCart(cart._id, productId, 1);

        res.send(cart);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

cartRouter.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const newCart = req.body;

    const result = await cartController.updateCart(cartId, newCart);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});

cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity; 

    const result = await cartController.updateQuantity(cartId, productId, newQuantity);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    
    const result = await cartController.deleteProductFromCart(cartId, productId);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});

cartRouter.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const result = await cartController.deleteAllProductsFromCart(cartId);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});

cartRouter.get('/:cid/purchase', async (req, res) => {
    const ticket = await ticketController.generateTicket(req.params.cid, req.session.user.email);

    res.send({ ticket });
});


export default cartRouter;
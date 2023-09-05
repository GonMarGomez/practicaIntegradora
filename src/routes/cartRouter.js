import { Router } from 'express';
import CartManager from '../dao/cartFSService.js';
import { productDBService } from '../dao/productDBservice.js';

const router = Router();

const cartManager = new CartManager();
const productDBManager = new productDBService();

router.post('/', async (req, res) => {
    const cart = await cartManager.createCart();

    res.send({ cart });
});

router.get('/:cid', async (req, res) => {
    const cartProducts = await cartManager.getCartById(req.params.cid);
    if (!cartProducts) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.send({cartProducts});
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

    const product = await productDBManager.getProductById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        }

        await cartManager.addProductToCart(cartId, productId, 1);

        res.send(cart);
});

export default router;
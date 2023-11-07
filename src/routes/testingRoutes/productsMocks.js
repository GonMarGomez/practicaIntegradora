import { Router} from 'express';
import { generateMockProducts } from '../../utils/mockProducts.js';

const router = Router();

router.get('/mockingproducts', async(req, res) => {
    const products = [];

    for (let i = 0; i < 100 ; i++) {
        products.push(generateMockProducts());
    }

    res.send({
        status: 'success',
        payload: products
    });
});

export default router;
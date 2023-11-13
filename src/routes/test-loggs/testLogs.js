import { Router } from 'express';
import productMock from '../testingRoutes/productsMocks.js'
import logger from '../testingRoutes/loggsTest.js'
const router = Router();

router.use('/mockingproducts', productMock);
router.use('/loggertest', logger);

export default router;
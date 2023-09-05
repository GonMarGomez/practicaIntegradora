import { Router } from "express";
import { productFSService } from "../dao/productFSService.js";

const router = Router();
const ProductService = new productFSService('Products.json')

router.get('/', (req, res)=>{
    res.render(
        'index',
        {
            title: 'GameShop',
            style: 'index.css',
            products: ProductService.getAllProducts()
        }
    )
});


export default router;
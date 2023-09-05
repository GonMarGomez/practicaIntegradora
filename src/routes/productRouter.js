import { Router } from "express";
import {productFSService} from '../dao/productFSService.js'
import { uploader } from "../utils/multerUtil.js";
import { productDBService } from "../dao/productDBservice.js";

const router = Router();

//const productService = new productFSService('Products.json')
const productService = new productDBService();
router.get('/', async (req, res)=>{
    const products = await productService.getAllProducts();
    res.send(products)
});
router.post('/', uploader.array('thumbnails', 3),(req, res)=>{

    if(req.files){
        req.body.thumbnails = []
      req.files.forEach((file)=>{
        req.body.thumbnails.push(file.filename)
      })
    }

    const result = productService.createProduct(req.body)
    res.send({
        messsage: result
    });
});

export default router;
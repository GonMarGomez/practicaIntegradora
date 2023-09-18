import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import { productDBService } from "../dao/productDBservice.js";

const router = Router();

const productService = new productDBService();
router.get('/', async (req, res) => {
  try {
    const queryParams = {
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort,
      category: req.query.category,
    };

    const products = await productService.getAllProducts(queryParams);

    res.send(products);
  } catch (error) {
    console.error('Error en la solicitud GET de productos:', error);
    res.status(500).send('Error interno del servidor');
  }
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
        messsage: result,
    });
});

export default router;
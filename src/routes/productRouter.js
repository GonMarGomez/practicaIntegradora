import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import { productController } from "../dao/controllers/productController.js";

const router = Router();

const productDBController = new productController();
router.get('/', async (req, res) => {
  try {
    const queryParams = {
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort,
      category: req.query.category,
    };

    const products = await productDBController.getAllProducts(queryParams);

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

    const result = productDBController.createProduct(req.body)
    res.send({
        messsage: result,
    });
});

export default router;
import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import { authorization } from "../utils/authorization.js";
import { productController } from "../dao/controllers/productController.js";
import CustomError from "../errorHandler/CustomError.js";
import { generateProductErrorInfo } from "../errorHandler/info.js";
import ErrorCodes from "../errorHandler/enums.js";

const router = Router();

const productDBController = new productController();

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const sort = req.query.sort;
  const category = req.query.category;
  const status = req.query.status;

  const products = await productDBController.getAllProducts(limit, sort, category, status, page);

  const queryParams = new URLSearchParams();
  if (limit) queryParams.set('limit', limit);
  if (sort) queryParams.set('sort', sort);
  if (category) queryParams.set('category', category);
  if (status) queryParams.set('status', status);

  const queryString = queryParams.toString();

  const response = {
    status: "success",
    payload: products.docs,
    totalPages: products.totalPages,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&${queryString}` : '',
    nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&${queryString}` : '',
  };

  res.send({
    status: 'success',
    payload: products
  });
})

router.get('/:pid', async (req, res) => {
  const product = await productDBController.getProductById(req.params.pid);

  if (!product) {
    return res.status(404).send({ error: 'Producto no encontrado' });
  }

  res.send({
    status: 'success',
    payload: product
  });
})


router.post('/', async (req, res, next) => {
  try {
    const { title, description, price, thumbnails, code, stock, category, status } = req.body;
    const user = req.user;
    if (!title || !description || !price || !code || !stock || !category) {
      CustomError.createError({
        name: 'Product creation error',
        cause: generateProductErrorInfo({ title, description, price, code, stock, category }),
        message: 'Error trying to create Product',
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
    // ...
    else if (user.role !== 'admin' && user.role !== 'premium') {
      res.status(401).send({
        status: 'error',
        message: 'Unauthorized.'
      });
    }
    const product = await productDBController.createProduct({ title, description, price, thumbnails, code, stock, category, status }, user);

    res.send({
      status: 'success',
      payload: product
    });
  }
  catch (error) {
    next(error);
  }
})

router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const modifications = req.body;

  const product = await productDBController.getProductById(productId);

  if (!product) {
    return res.status(404).send({ error: 'Producto no encontrado' });
  }

  await productDBController.updateProduct(productId, modifications);
  const updatedProduct = await productDBController.getProductById(productId);

  res.send(
    {
      status: 'success',
      payload: { updatedProduct }
    });
});

router.delete('/:pid', async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const user = req.user;
    console.log(user)
    const product = await productDBController.getProductById(productId);

    if (!product) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }
    if (user.role !== 'premium' && user.role !== 'admin') {
      return res.status(403).send({ error: 'No tienes permisos para realizar esta acción' });
    }
    if (user.role === 'premium' && product.owner !== user.email) {
      return res.status(403).send({ error: 'No puedes borrar productos que no te pertenecen' });
    }


    const deletedProduct = await productDBController.deleteProduct(productId);

    res.send({ deletedProduct, message: `El producto con Id ${productId} fue eliminado` });
  } catch (error) {
    console.error('Error al intentar eliminar el producto:', error);
    next(error);
  }
});






export default router;
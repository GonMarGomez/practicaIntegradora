import { Router } from "express";
import nodemailer from 'nodemailer';

import passport from 'passport';
import { authorization } from "../utils/authorization.js";
import CustomError from "../errorHandler/CustomError.js";
import { generateProductErrorInfo } from "../errorHandler/info.js";
import { productController } from "../dao/controllers/productController.js";
import ErrorCodes from "../errorHandler/enums.js";
import { canDeleteProduct } from "../utils/funcionUtil.js";
import UserController from "../dao/controllers/UserController.js";
const router = Router();


const productDBController = new productController();
const userDBController = new UserController();

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


router.post('/', authorization('premium'), async (req, res, next) => {
  try {

    const { title, description, price, thumbnails, code, stock, category, status } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
      CustomError.createError({
        name: 'Product creation error',
        cause: generateProductErrorInfo({ title, description, price, code, stock, category }),
        message: 'Error trying to create Product',
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
    let user = req.user 
    const product = await productDBController.createProduct({
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status
    }, user);

    res.send({
      status: 'success',
      payload: product
    });
  } catch (error) {
    next(error);
  }
});

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

// En productRouter.js

router.delete('/delete', async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const user = req.session.user;

    const product = await productDBController.getProductById(productId);

    if (!product) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }
    const productoToEliminate = product[0];
    const ownerId = productoToEliminate.owner.toString();
    let ownerProduct = await userDBController.getUserById(ownerId)
    
    if (user.role === 'admin' || (user.role === 'premium' && canDeleteProduct(user.role, user.email, ownerProduct))) {
  
      const productOwnerEmail = ownerProduct.email;     
      
      const deletedProduct = await productDBController.deleteProduct({ _id: productId });
      
      res.send({ deletedProduct, message: `El producto con Id ${productId} fue eliminado` });
      await sendProductDeletedEmail(productOwnerEmail, product[0].title);
    } else {
      res.status(403).send({ error: 'No tienes permisos para eliminar este producto' });
    }
  } catch (error) {
    console.error('Error al intentar eliminar el producto:', error);
    next(error);
  }
});


async function sendProductDeletedEmail(userEmail, productName) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});
  try {

    await transport.sendMail({
      from: 'Games Shop <tu-app@gmail.com>',
      to: userEmail,
      subject: 'Producto Eliminado',
      html: `
        <p>Hola,</p>
        <p>Tu producto "${productName}" ha sido eliminado.</p>
        <p>Gracias por usar nuestra plataforma.</p>
      `,
    });
    console.log(`Correo electrónico enviado a ${userEmail} sobre la eliminación de ${productName}`);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw new Error('Error al enviar el correo electrónico');
  }
}








export default router;
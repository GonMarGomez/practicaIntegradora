import { Router } from 'express';
import { productDBService } from '../dao/productDBservice.js';
import CartManager from '../dao/cartDBService.js';
import UserService from '../dao/userService.js';
const router = Router();
const US = new UserService()
const productDBManager = new productDBService();
const cartDBManager = new CartManager();

router.get('/products', async (req, res) => {
  try {
    const queryParams = {
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      sort: req.query.sort,
    };

    const productsData = await productDBManager.getAllProducts(queryParams);
    res.render('products', {
      products: productsData.payload,
      page: productsData.page,
      limit: productsData.limit,
      totalPages: productsData.totalPages,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevLink: productsData.prevLink,
      nextLink: productsData.nextLink,
      style: 'products.css',
      title: 'GameShop',
      user: req.session.user,
    });
  } catch (error) {
    res.render('error', console.log(error));
  }
});

router.get('/chat', (req, res) => {
  res.render('chat', {
    title: 'Chat - GameShop',
    style: 'chat.css',
  });
});

router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await productDBManager.getProductById(productId);
    res.render('product-details', {
      productDetails,
      style: 'productDetails.css',
    });
  } catch (error) {
    res.render('error', { error });
  }
});

let cart = {};

router.post('/addToCart', async (req, res) => {
  const productId = req.body.productId;
  const product = await productDBManager.getProductById(productId);

  if (Object.keys(cart).length === 0) {
    cart = await cartDBManager.createCart();
    await cartDBManager.addProductToCart(cart._id.toString(), product, 1);
  } else {
    await cartDBManager.addProductToCart(cart._id.toString(), product, 1);
  }

  res.status(204).send();
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartDBManager.getCartById(req.params.cid);

    if (!cart) {
      return res.status(404).render('error', { error: 'Carrito no encontrado' });
    }

    const cartId = cart[0]._id.toString();

    const products = cart[0].products.map((item) => ({
      title: item.product.title,
      description: item.product.description,
      price: item.product.price,
      id: item.product._id,
      quantity: item.quantity,
    }));

    res.render('cart-details', {
      title: 'Cart-GameShop',
      style: 'cart.css',
      cartId: cartId,
      products: products,
    });
  } catch (error) {
    res.render('error', { error });
  }
});

router.get('/', auth, async (req, res) => {
  res.render('index', {
    title: 'GameShop - Inicio',
    style: 'index.css',
    user: req.session.user,
  });
});


router.get("/login", logged, async (req, res) => {

  res.render(
      'login',
      {
          title: "Log In GamesShop",
          style: "login.css",
          loginFailed: req.session.loginFailed ?? false,
          registerSuccess: req.session.registerSuccess ?? false
      }
  );
});

router.get("/register", logged, async (req, res) => {

  res.render(
      'register',
      {
          title: "Register GamesShop",
          style: "register.css",
          registerFailed: req.session.registerFailed ?? false
      }
  );
});

function auth(req, res, next) {
  if (!req.session.user) {
      return res.redirect("/login");
  }

  next();
}

function logged(req, res, next) {
  if (req.session.user) {
      return res.redirect("/");
  }

  next();
}

export default router;

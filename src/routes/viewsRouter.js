import { Router } from 'express';
import { productController } from '../dao/controllers/productController.js';
import cartController from '../dao/controllers/CartController.js';
import UserController from '../dao/controllers/UserController.js';
import TicketController from '../dao/controllers/ticketsController.js';
import { authorization } from '../utils/authorization.js';

const router = Router();
const USController = new UserController()
const productDBController = new productController();
const cartDBController = new cartController();
const ticketController = new TicketController();

router.get('/products', async (req, res) => {
  try {
    const queryParams = {
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      sort: req.query.sort,
    };
    const user = req.session.user
    const cartid = user.cartId

    const productsData = await productDBController.getAllProducts(queryParams);
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


router.get('/chat', authorization('user'), (req, res) => {
  res.render('chat', {
    title: 'Chat - GameShop',
    style: 'chat.css',
  });
});

router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await productDBController.getProductById(productId);
    res.render('product-details', {
      productDetails,
      style: 'productDetails.css',
    });
  } catch (error) {
    res.render('error', { error });
  }
});

let cart = {};

router.post('/addToCart', authorization('user'), async (req, res) => {
  const productId = req.body.productId;
  const product = await productDBController.getProductById(productId);
  const cart = req.session.user.cartId


  await cartDBController.addProductToCart(cart, product, 1);

  res.status(204).send();
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartDBController.getCart(req.params.cid);

    if (!cart) {
      return res.status(404).render('error', { error: 'Carrito no encontrado' });
    }

    const productDetails = [];
    let totalPrice = 0;

    for (const cartProduct of cart.products) {
      const product = await productDBController.getProductById(cartProduct.product);
      if (product) {
        product.quantity = cartProduct.quantity; 

        productDetails.push(product);


        totalPrice += product[0].price * cartProduct.quantity;
      } else {
        console.error(`Producto con ID ${cartProduct.product} no encontrado.`);
      }
    }

    res.render('cart-details', {
      title: 'Cart-GameShop',
      style: 'cart.css',
      cartId: req.params.cid,
      products: productDetails,
      totalPrice,
    });
  } catch (error) {
    res.render('error', { error });
  }
});


router.post('/purchase', async (req, res) => {
  const emailUser = req.session.user.username
  const user = await USController.getUserByEmail({ email: emailUser})
  let cartId = null;

if (Array.isArray(user) && user.length > 0) {
    cartId = user[0].cart[0]._id.toString();
  
}
if (cartId) {
  let userId = user[0]._id.toString();
  const ticket = await ticketController.generateTicket(cartId,emailUser, userId);
  res.json({ ticket })
} else {
  console.error('No se encontro cartID')
}
 });



router.get('/ticket', async (req, res) => {
  const emailUser = req.session.user.username
  const user = await USController.getUserByEmail({ email: emailUser})
  const ticketId = user[0].ticket[0].ticketInfo;
  const ticket = await ticketController.getTicketById(ticketId)
  const response = {
      code : ticket[0].code,
      purchase_datetime: ticket[0].purchase_datetime,
      amount: ticket[0].amount,
      user: ticket[0].purchaser,
  };

  res.render(
      'ticket',
      {
          ticket: response,
          style: "ticket.css",
      }
  );
});
router.put('/tickets/finish', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('No se ha iniciado sesión');
    return;
  }
  const user = await USController.getUserByEmail(req.session.user.username)
  if (user && user.length > 0) {
    const userId = user[0]._id.toString();
    

    await ticketController.deleteTicketFromUser(userId);

 
    res.redirect('/products');
  } else {
    res.status(404).send('Usuario no encontrado');
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

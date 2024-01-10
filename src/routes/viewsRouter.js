import { Router } from 'express';
import nodemailer from 'nodemailer'

import { productController } from '../dao/controllers/productController.js';
import cartController from '../dao/controllers/CartController.js';
import UserController from '../dao/controllers/UserController.js';
import TicketController from '../dao/controllers/ticketsController.js';
import { authorization } from '../utils/authorization.js';
import { authorizationForRoles } from '../utils/authorization.js';


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
    const getCartId = await USController.getUserByEmail(req.session.user.email)
    const productsData = await productDBController.getAllProducts(queryParams);
    res.render('main', {
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
      style: 'main.css',
      title: 'GameShop',
      user: req.session.user,
      cart: getCartId.cart
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

router.post('/addToCart', authorizationForRoles(['user', 'premium']) , async (req, res) => {
  const productId = req.body.productId;
  const product = await productDBController.getProductById(productId);
  const cart = req.session.user.cart[0]


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
  try {
 
    const user = req.session.user;
    let userEmail = user.email
    const getUserID = await USController.getUserByEmail(userEmail)
    if (user && user.cart && user.cart.length > 0) {
      const cartId = user.cart[0]; 
      if (cartId) {
        const ObjectUserId = getUserID._id; 
        const idUser = ObjectUserId.toString();
         const ticket = await ticketController.generateTicket(cartId, userEmail, idUser);
        res.json({ ticket });
      } else {
        console.error('No se encontró cartID o userID válido');
        res.status(500).send('Error al procesar la solicitud');
      }
    } else {
      console.error('No se encontró usuario');
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

router.get('/ticket', async (req, res) => {
  try {
   
    const user = req.session.user;
    const userEmail = user.email;
    const findedUser = await USController.getUserByEmail(userEmail);

    if (findedUser) {
      const ticketInfo = findedUser.ticket;
      if (ticketInfo && ticketInfo.length > 0) {
        const ticketId = ticketInfo[0].ticketInfo;

        if (ticketId) {
          const ticket = await ticketController.getTicketById(ticketId);

          if (ticket && ticket.length > 0) {
            const response = {
              code: ticket[0].code,
              purchase_datetime: ticket[0].purchase_datetime,
              amount: ticket[0].amount,
              user: ticket[0].purchaser,
            };

            return res.render('ticket', {
              ticket: response,
              style: 'ticket.css',
            });
          }
          console.error('No se encontró información del ticket');
        } else {
          console.log('El usuario no tiene un ticket actualmente.');
        }
      } else {
        console.error('El campo ticket no está definido o es un array vacío.');
      }
    } else {
      console.error('No se encontró información del usuario.');
    }

    res.status(404).send('No se encontró información del ticket');
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});



router.put('/tickets/finish', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).send('No se ha iniciado sesión');
      return;
    }

    const email = req.session.user.email;
    const user = await USController.getUserByEmail(email);
    const ObjectUserId = user._id; 
    const idUser = ObjectUserId.toString();

    if (user) {
      const userId = idUser;
      const ticketInfo = user.ticket;
      const ticketId = ticketInfo[0].ticketInfo;

      const ticket = await ticketController.getTicketById(ticketId);
      await ticketController.deleteTicketFromUser(userId)
      await sendTicketEmail(email, ticket);

      res.send();
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

const sendTicketEmail = async (email, ticket) => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const result = await transport.sendMail({
      from: 'Gon Gomez <gonzalomgomez5@gmail.com>',
      to: email,
      subject: 'Detalles de tu compra',
      html: `
        <div>
          <h1>Detalles de tu compra</h1>
          <p><b>Código del ticket:</b> ${ticket[0].code}</p>
          <p><b>Fecha de compra:</b> ${ticket[0].purchase_datetime}</p>
          <p><b>Monto total:</b> $${ticket[0].amount}</p>
          <p><b>Usuario:</b> ${ticket[0].purchaser}</p>
          <p>Gracias por realizar la compra!</p>
        </div>`,
      attachments: [],
    });

    console.log('Correo electrónico enviado');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

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

//Funcion para administrar usuarios

router.get('/admin/users', authorization('admin'), async (req, res) => {
  try {
    const allUsers = await USController.getAllUsers();
    res.render('admin-users', {
      title: 'Admin Users - GameShop',
      style: 'admin-users.css',
      users: allUsers,
    });
  } catch (error) {
    res.render('error', { error });
  }
});


router.post('/admin/users/update-role/:email', authorization('admin'), async (req, res) => {
  try {
      const userEmail = req.params.email;
      const newRole = req.body.newRole;

      const user = await USController.getUserByEmail(userEmail);

      if (!user) {
          throw new Error(`Usuario con el correo electrónico ${userEmail} no encontrado.`);
      }
      await USController.updateUserRole(user._id, newRole);

      res.redirect('/admin/users');
  } catch (error) {
      res.render('error', { error });
  }
});
router.get('/create/product', async(req, res) => {
  res.render('create-products', {
    title: 'Create Products - GameShop',
    style: 'create-products.css',
  });
});

router.post('/admin/users/delete/:email', authorization('admin'), async (req, res) => {
  try {
      const userEmail = req.params.email;
      const user = await USController.getUserByEmail(userEmail);

      if (!user) {
          throw new Error(`Usuario con el correo electrónico ${userEmail} no encontrado.`);
      }
      await  USController.deleteUser(user._id);

      res.redirect('/admin/users');
  } catch (error) {
      res.render('error', { error });
  }
});


function auth(req, res, next) {
  if (!req.session.user) {
    if (req.path !== '/login') {
      return res.redirect("/login");
    }
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

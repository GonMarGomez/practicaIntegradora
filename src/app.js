import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


import productRouter from './routes/productRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import __dirname from './utils/constantUtils.js';
import ChatController from './dao/controllers/chatController.js';
import ErrorHandler from './middlewares/index.js'
import mockingProducts from './routes/testingRoutes/productsMocks.js'
import initializatePassport from './config/passportConfig.js';
import mailRouter from './routes/mailRouter.js';
import testLoggs from './routes/test-loggs/testLogs.js'
import changePasswordRouter from './routes/forgotPasswordRouter.js'
import { addLogger } from './middlewares/logger.js';


const uri = process.env.MONGO_URI
const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

mongoose.connect(uri);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: uri,
      mongoOptions: { useUnifiedTopology: true },
      ttl: 10000,
    }),
    secret: 'secretPhrase',
    resave: false,
    saveUninitialized: false,
  })
);
const swaggerOptions = {
  definition: {
      openapi: '3.0.3',
      info: {
          title: "Documentación",
          description: "API de Tienda de Videojuegos",
      }
  },
  apis:[`${__dirname}/../../docs/**/*.yaml`],
}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger)
app.use('/api/product', productRouter);
app.use(ErrorHandler)
app.use('/', viewsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/sessions', userRouter);
app.use('/send',mailRouter)
app.use('/forgot-password', changePasswordRouter)
app.use('/test', mockingProducts)
app.use('/testLog', testLoggs)


const PORT = process.env.PORT||8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Start server in port ${PORT}`);
});
const io = new Server(httpServer);
const messages = [];
const chatController = new ChatController();
io.on('connection', socket => {
  console.log('Nuevo cliente conectado ', socket.id);
  
  socket.on('message', async data => {
    try {
      await chatController.saveChat(data); 
    } catch (error) {
      console.error('Error al guardar el mensaje en la base de datos:', error.message);
    }
    messages.push(data);
    io.emit('messagesLogs', messages);
  });
  
  socket.on('userConnect', async data => {
    socket.emit('messagesLogs', await chatController.getChats());
    socket.broadcast.emit('newUser', data);
    });
  });

  
  
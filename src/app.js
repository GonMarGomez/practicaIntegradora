import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import productRouter from './routes/productRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import __dirname from './utils/constantUtils.js';
import { messageModel } from './modules/chatModel.js';
import initializatePassport from './config/passportConfig.js';

const uri = 'mongodb+srv://GonGomez:proyectoCoderHouse@cluster0.cjpuc82.mongodb.net/ecommerce?retryWrites=true&w=majority';
mongoose.connect(uri);
const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

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

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/sessions', userRouter);

const PORT = 8080;
const htttpServer = app.listen(PORT, () => {
  console.log(`Start server in port ${PORT}`);
});

const io = new Server(htttpServer);
const messages = [];
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado ', socket.id);

  socket.on('message', async (data) => {
    try {
      await messageModel.create(data);
    } catch (error) {
      console.error('Error al guardar mensajes en DB');
    }
    messages.push(data);
    io.emit('messagesLogs', messages);
  });

  socket.on('userConnect', (data) => {
    socket.emit('messagesLogs', messages);
    socket.broadcast.emit('newUser', data);
  });
  socket.on('userConnect', async (data) => {
    socket.emit('messagesLogs', await messageModel.find());
    socket.broadcast.emit('newUser', data);
  });
});

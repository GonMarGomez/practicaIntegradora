import express from 'express'
import handlebars from 'express-handlebars'
import productRouter from './routes/productRouter.js'
import viewsRouter from './routes/viewsRouter.js'
import __dirname from './utils/constantUtils.js';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import router from './routes/viewsChat.js';
import { messageModel } from './modules/chatModel.js';


const uri = 'mongodb://127.0.0.1:27017/ecommerce'
mongoose.connect(uri)
const app = express()

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


app.use('/api/product', productRouter)
app.use('/products', viewsRouter)
app.use('/' , router)

const PORT = 8080;
const htttpServer = app.listen(PORT, ()=>{
    console.log(`Start server in port ${PORT}`);
});

const io = new Server(htttpServer)
const messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado ', socket.id);

    socket.on('message',async data => {
        try{
            await messageModel.create(data);
        }
        catch(error){
            console.error('Error al guardar mensajes en DB')
        }
        messages.push(data);
        io.emit('messagesLogs', messages);
    });

    socket.on('userConnect', data => {
        socket.emit('messagesLogs', messages);
        socket.broadcast.emit('newUser', data);
    })
    socket.on('userConnect', async data => {
        socket.emit('messagesLogs', await messageModel.find());
        socket.broadcast.emit('newUser', data);
    });

});
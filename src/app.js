import express, {urlencoded} from 'express';
import mongoose from 'mongoose';
import handlerbars from 'express-handlebars'; 
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import chatRouter from './routes/chat.router.js';
import authRouter from './routes/auth.router.js';

import __dirname from './utils.js';


const app = express();
const dataBase = "mongodb+srv://kathegomv:mipassword12@cluster0.5dd2jbo.mongodb.net/ecommerce?retryWrites=true&w=majority"

//Middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración session
app.use(session({
    store:MongoStore.create({
        mongoUrl: dataBase,
        mongoOptions: {useNewUrlParses: true, useUnifiedTopology: true},
    }),
    secret:"claveSecreta",
    resave: true,
    saveUninitialized: true,
}))


// Configuración Handlebars
app.engine("handlebars", handlerbars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));


//Routers
app.use('/', viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/chat", chatRouter);
app.use("/api", authRouter);
// app.use("/api/auth", authRouter);


const httpServer= app.listen(8080, () => {
    console.log('listening on port 8080')
})


//Mongoose
try {
    await mongoose.connect(dataBase)
    console.log("connected to DB")
}catch(err){
    console.log(err.mensaje)
}

// Websocket
const io = new Server(httpServer);
const messages = [];

io.on("connection", (socket)=>{
    console.log("New client connected.")

    socket.on("chat-message", (data)=>{
        messages.push(data);
        io.emit("messages", messages)
    })

    socket.on("new-user", (username) => {
        socket.emit("messages", messages);
        socket.broadcast.emit("new-user", username);
    })
    socket.on('productList', (data) => {
        io.emit('updatedProducts', data)
    })

})

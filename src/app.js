import express, {urlencoded} from 'express';
import mongoose from 'mongoose';
import handlerbars from 'express-handlebars'; 
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import chatRouter from './routes/chat.router.js';

import __dirname from './utils.js';


const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));


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


const httpServer= app.listen(8080, () => {
    console.log('listening on port 8080')
})


// Websocket
const io = new Server(httpServer);

io.on("connection", (socket)=>{
    console.log("New client connected.")

    io.on("new-user", (username) => {
        io.emit("messages", messages);
        io.broadcast.emit("new-user", username);
    })
    socket.on("chat-message", (data)=>{
        messages.push(data);
        io.emit("messages", messages)
    })
    socket.on('productList', (data) => {
        socketServer.emit('updatedProducts', data)
    })

})

//Mongoose
try {
    await mongoose.connect("mongodb+srv://kathegomv:mipassword12@cluster0.5dd2jbo.mongodb.net/",{
        dbName : "ecommerce"
    })
    console.log("connected to DB")
}catch(err){
    console.log(err.mensaje)
}
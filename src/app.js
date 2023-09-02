import express, {urlencoded} from 'express';
import handlerbars from 'express-handlebars'; 
import __dirname from './utils.js';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';


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


// Configuración Websocket
const httpServer = app.listen(8080, () =>{
    console.log("listening on port 8080");
});
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket)=>{
    console.log("New client connected.")

    socket.on('productList', (data) => {
        socketServer.emit('updatedProducts', data)
    })

})

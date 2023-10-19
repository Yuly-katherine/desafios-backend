import { Router } from "express";
import { ProductsManager} from "../dao/index.js";
import { CartManager} from "../dao/index.js";
import { ChatManager} from "../dao/index.js";
import {auth} from "../middlewares/auth.middleware.js"

const viewsRouter = Router()
const productsManager = new ProductsManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();

//Handlebars views

viewsRouter.get("/", async (req, res) => {
  res.render("home")
})


viewsRouter.get("/login",(req,res) =>{
  res.render("login");
})

viewsRouter.get("/signup",(req,res) =>{
  res.render("signup");
})

viewsRouter.get("/auth/failure-signup",(req,res) =>{
  res.render("failure-signup");
})

viewsRouter.get("/auth/failure-login",(req,res) =>{
  res.render("failure-login");
})


viewsRouter.get("/products", auth ,async (req, res) => {
const { limit } = req.query;
  const { page } = req.query;
  const { sort } = req.query;
  const querykey = req.query.category;

  const products = await productsManager.getProducts(
    limit,
    page,
    sort,
    querykey
  );
    const userData = req.session.user;
    res.render("products", {products, userData});
})

viewsRouter.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const cartById = await cartManager.getCartById(cartId);

    if (!cartById) {
        return alarm(`El carrito con el id: ${cartId} no existe`)
    } 

    res.render("cartById", {cartById})
})


//for this delivery is disabled
// viewsRouter.get("/chat", async (req,res)=>{
//     const chat = await chatManager.getAllInteractions()
//     res.render("chat" , {chat})            
    
// })

// viewsRouter.get("/realTimeProducts", async (req,res)=>{
//     const products = await productsManager.getProducts()
//     res.render("realTimeProducts" , {products})            
    
// })



export default viewsRouter
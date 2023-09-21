import { Router } from "express";
import { ProductsManager} from "../dao/index.js";
import { CartManager} from "../dao/index.js";
import { ChatManager} from "../dao/index.js";


const viewsRouter = Router()
const productsManager = new ProductsManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();

viewsRouter.get("/products", async (req,res)=>{
    const products = await productsManager.getProducts()
    res.render("home", {products})
})

viewsRouter.get("/realTimeProducts", async (req,res)=>{
    const products = await productsManager.getProducts()
    console.log(products, "produucts oeeeeeeeeeeeeeeee")
    res.render("realTimeProducts" , {products})            
    
})

viewsRouter.get("/chat", async (req,res)=>{
    const chat = await chatManager.getAllInteractions()
    res.render("chat" , {chat})            
    
})

export default viewsRouter
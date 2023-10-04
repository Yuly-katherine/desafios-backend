import { Router } from "express";
import { ProductsManager} from "../dao/index.js";
import { CartManager} from "../dao/index.js";
import { ChatManager} from "../dao/index.js";


const viewsRouter = Router()
const productsManager = new ProductsManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();


viewsRouter.get("/products", async (req, res) => {
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
    res.render("products", {products});
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
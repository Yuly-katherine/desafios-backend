import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';


const manager = new ProductManager('./data/products.json');
const viewsRouter = Router()

viewsRouter.get("/", async (req,res)=>{
    const products = await manager.getProducts()
    res.render("home", {products})
})

viewsRouter.get("/realTimeProducts", async (req,res)=>{
    const products = await manager.getProducts()
    res.render("realTimeProducts" , {products})            
    
})

export default viewsRouter
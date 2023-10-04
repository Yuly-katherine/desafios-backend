import { Router } from 'express';
import { ProductsManager} from "../dao/index.js";
import { CartManager} from "../dao/index.js";

const router = Router()
const productsManager = new ProductsManager();
const cartManager = new CartManager();



// get all carts
router.get('/', async(req, res) => {
    const allCarts = await cartManager.getAllCarts();
    res.status(201).send({result: "success", payload: allCarts})
})


// get cart by id
router.get('/:cid', async(req, res) => {
    const cartId = req.params.cid;
    const cartById = await cartManager.getCartById(cartId);

    if (!cartById) {
        return res.status(404).send({error: `El carrito con el id: ${cartId} no existe`})
    }
    res.status(201).send({ result: "success", payload: cartById });
})


// create a new cart
router.post('/', async(req, res) => {
    const newCart = await cartManager.addCart()
    res.status(201).send({ result: "success", payload: newCart });
});


//  update quantity in a product by Id in a specific cart by Id
router.put('/:cid/products/:pid', async(req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantityInfo = req.body;
    const cartById = await cartManager.getCartById(cartId);
    if (!cartById) {
        return res.status(404).send({error: `El carrito con el id: ${cartId} no existe`})
    }
    if (!prodId) {
        return res.status(404).send({error: `Debe ingresar el ID del producto`})
    }
    if (!quantityInfo) {
        return res.status(404).send({error: `Debe ingresar la cantidad`})
    }

    const updateCart = await cartManager.addProductToCart(cartId, prodId, quantityInfo);
    res.status(201).send({ result: "success", payload: updateCart });
});

// update all products in a cart
router.put('/:cid', async(req, res) => {
    const cartId = req.params.cid;
    const products = req.body
    const cartById = await cartManager.getCartById(cartId);
    if (!cartById) {
        return res.status(404).send({eror: `El carrito con el id: ${cartId} no existe`})
    } 
    if (!products) {
        return res.status(404).send({eror: "No se ha ingresado la información de los productos"})
    } 
    const updateCart = await cartManager.updateAllProductInCart(cartId, products);
    res.status(201).send({ result: "success", payload: updateCart }); 
});

// delete a selected product in a specific cart
router.delete('/:cid/product/:pid', async(req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const cartById = await cartManager.getCartById(cartId);
    if (!cartById) {
        return res.status(404).send({error: `El carrito con el id: ${cartId} no existe`})
    }
    const updateCart = await cartManager.deleteProductInCart(cartId, prodId);
    if(typeof updateCart === Array){
        res.status(201).send({ result: "success", payload: updateCart });
    }else {
        res.status(404).send({error: `El producto con el id: ${prodId} no existe`})
    }
});


// delete all products in a cart
router.delete('/:cid', async(req, res) => {
    const cartId = req.params.cid;
    const cartById = await cartManager.getCartById(cartId);
    if (!cartById) {
        return res.status(404).send({eror: `El carrito con el id: ${cartId} no existe`})
    }
    const updatedCart = await cartManager.deleteAllProductsInCart(cartId);

    res.status(201).send({ result: "success", payload: updatedCart });
});


//add product to cart, this method is used in products view
router.post('/:cid/products/:pid', async(req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const cartById = await cartManager.getCartById(cartId);
    const productById = await productsManager.getProductById(prodId);
    if (!cartById) {
        return res.status(404).send({error: `El carrito con el id: ${cartId} no existe`})
    } 
    if (!productById) {
        return res.status(404).send({error: `El producto con el id: ${prodId} no existe`})
    } 
    const updateCart = await cartManager.addProductInCart(cartId, productById);
    res.status(201).send({ result: "success", payload: updateCart }); 
});

export default router;
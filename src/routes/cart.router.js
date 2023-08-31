import { Router } from 'express';
import CartManager from '../files/CartManager.js'

const router = Router();
const cartManager = new CartManager(('./data/carts.json'));


// get all carts
router.get('/', async(req, res) => {
    const allCarts = await cartManager.getAllCarts();
    res.status(201).send({result: "success", payload: allCarts})
})


// get cart by id
router.get('/:cid', async(req, res) => {
    const cartId = parseInt(req.params.cid);
    const cartById = await cartManager.getCartById(cartId);

    if (!cartById) {
        return res.status(404).send({error: `El carrito con el id: ${cartId} no existe`})
    }
    res.status(201).send({ result: "success", payload: cartById });
})


// create a new cart
router.post('/', async(req, res) => {
    const updateCart = await cartManager.addCart()
    res.status(201).send({ result: "success", payload: updateCart });
});


//  update quantity in a product by Id in a specific cart by Id
router.post('/:cid/product/:pid', async(req, res) => {
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    const cartById = await cartManager.getCartById(cartId);
    if (!cartById) {
        return res.status(404).send({error: `El carrito con el id: ${cartId} no existe`})
    }

    const updateCart = await cartManager.addProductToCart(cartId, prodId);
    res.status(201).send({ result: "success", payload: updateCart });
});


export default router;
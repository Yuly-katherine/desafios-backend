import { Router} from 'express';
import  ProductsManager  from '../manager/ProductManager.js'

const productsManager = new ProductsManager('./data/products.json');
const router = Router();


// get all products
router.get('/', async(req, res) => {
    const { limit } = req.query;
    const products = await productsManager.getProducts(limit);
    if(limit) {
        res.status(201).send({result: "success", payload: products.slice(0, limit)})
       }else{
        res.status(201).send(products);
       }
    
})


// get product by id
router.get('/:pid', async(req, res) => {
    const id= parseInt(req.params.pid);
    const productById = await productsManager.getProductById(id);

    if (!productById) {
    return res.status(404).send({error: `El producto con el id: ${id} no existe`})
    } 
    return res.status(201).send({result: "success", payload: productById})
});


// create new product
router.post('/', async(req, res) => {
    const  {title, description, price, code, stock, category} = req.body;
    const newProductProperties = {title, description, price, code, stock, category}

    if (Object.values(newProductProperties).includes(undefined)) {
        return res.status(400).send({error: "No se han ingresado todos los datos"})
    } 

    const result = await productsManager.addProduct(newProductProperties);
    return res.status(201).send({result: "success", payload: result})
});


// update a product
router.put('/:pid', async(req, res) => {
    const productId = parseInt(req.params.pid);
    const  {title, description, price, code, stock, category} = req.body;
    const productProperties = {title, description, price, code, stock, category}

    if (!productId) {
        return res.status(400).send({error: `el ID: ${productId} no existe`});
    }

    if (Object.values(productProperties).includes(undefined)) {
        return res.status(400).send({error: "No se han ingresado todos los datos"})
    } 

    const updateProduct = await productsManager.updateProduct(productId, productProperties)
    return res.status(201).send({result: "success", payload: updateProduct})   
});


// delete  a product
router.delete('/:pid', async(req, res) => {   
    const productId = parseInt(req.params.pid);

    if (!productId) {
        return res.status(400).send({error: `el ID: ${productId} no existe`});
    }
   const products = await productsManager.deleteProduct(productId);
   
    return res.status(201).send({result: "success", payload: products})  
})


export default router;
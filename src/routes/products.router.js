import { Router } from "express";
import { ProductsManager } from "../dao/index.js";

const router = Router();
const productsManager = new ProductsManager();

// get all products
router.get("/", async (req, res) => {
  const { limit, page, sort } = req.query;
  const querykey = req.query.category;

  const products = await productsManager.getProducts(
    limit,
    page,
    sort,
    querykey
  );
  res.status(201).send({ result: "success", payload: products });
});

// get product by id
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productById = await productsManager.getProductById(id);
  if (!productById) {
    return res
      .status(404)
      .send({ error: `El producto con el id: ${id} no existe` });
  }
  return res.status(201).send({ result: "success", payload: productById });
});

// create new product
router.post("/", async (req, res) => {
  const { title, description, price, code, stock, category } = req.body;
  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
    category,
  };
  if (Object.values(newProduct).includes(undefined || "")) {
    return res
      .status(400)
      .send({ error: "No se han ingresado todos los datos" });
  }

  const allProducts = await productsManager.getProducts();
  const productCodeExist = allProducts.docs.find((prod) => {
    return prod.code === newProduct.code;
  });
  if (productCodeExist) {
    return res.status(400).send({
      error: `El code: ${newProduct.code} se encuentra repetido`,
    });
  }

  const result = await productsManager.addProduct(newProduct);
  return res.status(201).send({ result: "success", payload: result });
});

// update a product
router.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const { title, description, price, code, stock, category } = req.body;
  const product = {
    title,
    description,
    price,
    code,
    stock,
    category,
  };
  if (!productId) {
    return res
      .status(400)
      .send({ error: `No ha ingresado el ID del producto` });
  }
  if (Object.values(product).includes(undefined || "")) {
    return res
      .status(400)
      .send({ error: "No se han ingresado todos los datos" });
  }
  const allProducts = await productsManager.getProducts();
  const productCodeExist = allProducts.docs.find((prod) => {
    return prod.code === product.code;
  });
  if (productCodeExist) {
    return res.status(400).send({
      error: `El code: ${product.code} se encuentra repetido`,
    });
  }

  const updateProduct = await productsManager.updateProduct(
    productId,
    product
  );
  return res.status(201).send({ result: "success", payload: updateProduct })
});

// delete  a product
router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  if (!productId) {
    return res.status(400).send({ error: "No se ha ingresado el ID" });
  }

  const products = await productsManager.deleteProduct(productId);
  if(typeof products === Array){
    return res.status(201).send({ result: "success", payload: products });
  }
  return res.status(400).send({ error: `El producto con el ID: ${productId} no existe` });
});

export default router;

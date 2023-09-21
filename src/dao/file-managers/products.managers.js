import fs from "fs";
import __dirname from "../../utils.js";

const path = __dirname + "/dao/file-managers/files/products.json";

class ProductManager {
  constructor() {
    console.log("Working with courses using filesystem");
  }

  async addProduct(newProductProperties) {
    const products = await this.getProducts();

    const nuevoProducto = {
      id: await this.updateId(products),
      title: newProductProperties.title,
      description: newProductProperties.description,
      price: newProductProperties.price,
      code: newProductProperties.code,
      stock: newProductProperties.stock,
      category: newProductProperties.category,
      status: true,
    };
    const updateProducts = [...products, nuevoProducto];
    await fs.promises.writeFile(path, JSON.stringify(updateProducts));
    return updateProducts;
  }

  async getProducts() {
    if (fs.existsSync(path)) {
      const products = await fs.promises.readFile(path, "utf-8");

      return JSON.parse(products);
    }

    return [];
  }

  async updateId(products) {
    if (products.length > 0) {
      const ids = products.map((prods) => prods.id);
      let maxIds = Math.max(...ids);
      return maxIds + 1;
    } else {
      return 0;
    }
  }

  async getProductById(productId) {
    const products = await this.getProducts();
    const product = products.find((item) => {
      return item.id === productId;
    });
    if (!product) {
      throw new Error(`El producto con el ID: ${productId} no existe`);
    } else {
      return product;
    }
  }

  async updateProduct(productId, productProperties) {
    let products = await this.getProducts();
    const index = products.findIndex((element) => {
      return element.id === productId;
    });
    if (index === -1) {
      throw new Error(`El producto con el ID ${productId} no existe`);
    } else {
      const updateProduct = {
        id: productId,
        title: productProperties.title || products[index].title,
        description:
          productProperties.description || products[index].description,
        price: productProperties.price || products[index].price,
        code: productProperties.code || products[index].code,
        stock: productProperties.stock || products[index].stock,
        category: productProperties.category || products[index].category,
        status: true,
      };
      products[index] = updateProduct;
      await fs.promises.writeFile(path, JSON.stringify(products));
      return products;
    }
  }

  async deleteProduct(productId) {
    console.log(productId, "productId");
    let products = await this.getProducts();
    const index = products.findIndex((element) => {
      return element.id === productId;
    });
    if (index === -1) {
        throw new Error(`El producto con el ID: ${productId} no existe`);
    } else {
      products.splice(index, 1);
      await fs.promises.writeFile(path, JSON.stringify(products));
      return products;
    }
  }
}

export default ProductManager;

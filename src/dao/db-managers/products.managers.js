import productModel from "../models/schema.products.js";

class ProductManager {
  async addProduct(newProductProperties) {

    const newProduct = {
      title: newProductProperties.title,
      description: newProductProperties.description,
      price: newProductProperties.price,
      code: newProductProperties.code,
      stock: newProductProperties.stock,
      category: newProductProperties.category,
    };
    await productModel.create(newProduct);
    const products = await this.getProducts();
    return products;
  }

  async getProducts() {
    const products = await productModel.find().lean();
    if (products) {
      return products;
    }
    return [];
  }

  async getProductById(productId) {
    const productById = await productModel.findOne({ _id: productId});

    if (!productById) {
      throw new Error(`El producto con el ID: ${productId} no existe`);
    } else {
      return productById;
    }
  }

  async updateProduct(productId, productProperties) {
    const productById = await productModel.findOne({_id:productId});;
    if (productById) {
      const updateProduct = {
        id: productId,
        title: productProperties.title || productById.title,
        description: productProperties.description || productById.description,
        price: productProperties.price || productById.price,
        code: productProperties.code || productById.code,
        stock: productProperties.stock || productById.stock,
        category: productProperties.category || productById.category,
      };
      await productModel.findOneAndUpdate({ _id: productId }, updateProduct, {
        new: true,
      });
      const updateProducts = await this.getProducts();
      return updateProducts;
    } else {
        throw new Error(`El producto con el ID: ${productId} no existe`);
    }
  }

  async deleteProduct(productId) {
    const productById = await productModel.findOne({_id:productId});
    if (productById) {
      await productModel.deleteOne({_id:productId});
      const updateProducts = await this.getProducts();
      return updateProducts;
    } else {
        throw new Error(`El producto con el ID: ${productId} no existe`);
    }
  }
}

export default ProductManager;

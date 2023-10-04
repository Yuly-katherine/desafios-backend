import productModel from "../models/schema.products.js";

class ProductManager {
  // get all products
  async getProducts(limitInfo, pageInfo, sort, query) {
    let sortInfo = sort ? { price: sort } : {};
    let filterOptions = query ? { category: query } : {};
    const paginateOptions = {
      limit: limitInfo ?? 10,
      page: pageInfo ?? 1,
      lean: true,
      sort: sortInfo,
    };
    try {
      const products = await productModel.paginate(filterOptions, paginateOptions);
      return products;
    } catch (error) {
      return [];
    }
  }

  // get product by id
  async getProductById(productId) {
    const productById = await productModel.findOne({ _id: productId });

    if (!productById) {
      console.error(`El producto con el ID: ${productId} no existe`);
      return {};
    } else {
      return productById;
    }
  }

  // create new product
  async addProduct(product) {
    const newProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      code: product.code,
      stock: product.stock,
      category: product.category,
    };
    await productModel.create(newProduct);
    const allProducts = await this.getProducts();
    return allProducts;
  }

  // update a product
  async updateProduct(productId, product) {
    const productById = await productModel.findOne({ _id: productId });
    if (productById) {
      const updateProduct = {
        id: productId,
        title: product.title || productById.title,
        description: product.description || productById.description,
        price: product.price || productById.price,
        code: product.code || productById.code,
        stock: product.stock || productById.stock,
        category: product.category || productById.category,
      };
      await productModel.findOneAndUpdate({ _id: productId }, updateProduct, {
        new: true,
      });
      const updatedProducts = await this.getProducts();
      return updatedProducts;
    } else {
      console.error(`El producto con el ID: ${productId} no existe`);
      return {};
    }
  }

  // delete  a product
  async deleteProduct(productId) {
    const productById = await productModel.findOne({ _id: productId });
    if (productById) {
      await productModel.deleteOne({ _id: productId });
      const updatedProducts = await this.getProducts();
      return updatedProducts;
    } else {
      return console.error(`El producto con el ID: ${productId} no existe`);
    }
  }
}

export default ProductManager;

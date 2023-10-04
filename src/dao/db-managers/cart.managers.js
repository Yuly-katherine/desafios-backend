import cartModel from "../models/schema.cart.js"
import productModel from "../models/schema.products.js";

class CartManager {

  // get all carts
  async getAllCarts() {
    try {
      const allCarts = await cartModel.find().lean();
      return allCarts
    } catch (error) {
      return [];
    }
  }

  // get cart by id  
  async getCartById(cartId) {
    const cartById = await cartModel.find({_id:`${cartId}`}).populate('products.product').lean();
    if (!cartById) {      
      console.error(`El carrito con el ID: ${cartId} no existe`);
      return {}
    } else {
      return cartById;
    }
  }

  // create a new cart
  async addCart() {
    const newCart = {
      products: [],
    };
    const response = await cartModel.create(newCart);
    return response;
  }

  //  update quantity in a product by Id in a specific cart by Id
  async addProductToCart(cartId, productId, quantityInfo) {
    const cartById = await cartModel.findById(cartId);
    const productSelected = cartById.products.find(prod => {
      return productId.includes(prod.product._id)
    })

    if(!productSelected) {
      console.error(`El producto con el ID: ${productId} no existe`);
      return {}
    } else {
      const index = cartById.products.findIndex(prod => {
        return productId.includes(prod.product._id)
      })
      cartById.products[index].quantity = productSelected.quantity + quantityInfo.quantity
      const updateProduct = cartById.products;
      await cartModel.updateOne(
        { _id: cartId },
        { $push: { products: { $each: updateProduct } } }
      );
      const updateCart = await this.getAllCarts();
      return updateCart;
    }
  }

  // update all products in a cart
  async updateAllProductInCart(cartId, product) {
      await cartModel.updateOne(
      { _id: cartId },
      { $push: { products: {  $each:product } } }
    );
    const cartById = await cartModel.findById(cartId);
    return cartById;
  }

  // delete a selected product in a specific cart
  async deleteProductInCart(cartId, productId) {
    const cartById = await this.getCartById(cartId);

    const productSelected = cartById[0].products.find(prod => {
      return productId.includes(prod.product._id)
    })
    if(!productSelected){
      return console.error(`El producto con el ID: ${productId} no existe`);
    } else {
    
      await cartModel.updateOne(
        { _id: cartId },
        { $pull: { products: { product: productId } } }
      );
      const updatedProducts = await this.getAllCarts();
      return updatedProducts;
    }
  }

  // delete all products in a cart
  async deleteAllProductsInCart(cartId) {
    await cartModel.updateOne(
      { _id: cartId },
      { $pull: { products: {} } }
    );
    const updateProducts = await this.getAllCarts();
    return updateProducts;
  } 

  //add product to cart, this method is used in products view
  async addProductInCart(cartId, product) {
    await cartModel.updateOne(
    { _id: cartId },
    { $push: { products: {  product } } }
  );
  const cartById = await cartModel.findById(cartId);
  return cartById;
}

}

export default CartManager;

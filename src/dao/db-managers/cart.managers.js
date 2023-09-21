import cartModel from "../models/schema.cart.js"

class CartManager {

  async getCartById(cartId) {
    const cart = await cartModel.findOne({ _id: cartId});
    if (!cart) {      
      throw new Error(`El carrito con el ID: ${cartId} no existe`);
    } else {
      return cart;
    }
  }

  async getAllCarts() {
    const allCarts = await cartModel.find().lean();
    if(allCarts) {
        return allCarts
    }
    return [];
  }


  async addCart() {
    const newCart = {
      products: [],
    };
    await cartModel.create(newCart);
    const updateCart = await this.getAllCarts();
    return updateCart;
  }

  //  update quantity in a product by Id in a specific cart by Id
  async addProductToCart(cartId, productId) {
    const cartById = await cartModel.findById(cartId);
    if (!cartById) {
      console.error(`El carrito con el ID: ${cartId} no existe`);
      return {}
    } 

    const indexProductSelected = cartById.products.findIndex(prod => prod.id === productId
    )
    if(indexProductSelected !== -1) {
      cartById.products[indexProductSelected].quantity += 1
    } else {
        cartById.products.push({product:productId, quantity:1 })
    }
    await cartModel.findOneAndUpdate({ _id: cartId }, cartById, {
      new: true,
    });
    return cartById;

    // const allCarts = await this.getAllCarts();
    // const index = allCarts.findIndex(cart => {
    //   return cart.id === cartId
    // })

    // allCarts[index] = cartById

    // await fs.promises.writeFile(this.path, JSON.stringify(allCarts))
    // return cartById;

  }

}

export default CartManager;

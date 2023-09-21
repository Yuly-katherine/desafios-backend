import fs from "fs";
import __dirname from "../../utils.js";

const path = __dirname + "/dao/file-managers/files/carts.json";

class CartManager {

  constructor() {
    console.log("Working with users using filesystem");
  }

  async getCartById(cartId) {
    const allCarts = await this.getAllCarts();
    const cart = allCarts.find((item) => {
      return item.id === cartId;
    });
    if (!cart) {
      throw new Error(`El carrito con el ID: ${cartId} no existe`);
    } else {
      return cart;
    }
  }

  async getAllCarts() {
    if (fs.existsSync(path)) {
      const allCarts = await fs.promises.readFile(path, "utf-8");
      return JSON.parse(allCarts);
    }
    return [];
  };
  
  async addCart() {
    const carts = await this.getAllCarts();

    const newCart = {
      products: [],
      id: await this.updateCartId(carts),
    };
    const updateCarts = [...carts, newCart];
    await fs.promises.writeFile(path, JSON.stringify(updateCarts));
    return updateCarts;
  }


  async updateCartId(carts) {
    if (carts.length === 0) {
      return 0;
    } else {
      const ids = carts.map((prods) => prods.id);
      let maxIds = Math.max(...ids);
      return maxIds + 1;
    }
  }

  //  update quantity in a product by Id in a specific cart by Id
  async addProductToCart(cartId, productId) {
    const cartById = await this.getCartById(cartId)
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

    const allCarts = await this.getAllCarts();
    const index = allCarts.findIndex(cart => {
      return cart.id === cartId
    })

    allCarts[index] = cartById

    await fs.promises.writeFile(path, JSON.stringify(allCarts))
    return cartById;

  }

}

export default CartManager;

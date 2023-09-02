import fs from "fs";

class CartManager {

  constructor(path) {
    this.path = path;
  }

  async getCartById(cartId) {
    const allCarts = await this.getAllCarts();
    const cart = allCarts.find((item) => {
      return item.id === cartId;
    });
    if (!cart) {
      console.error(`El carrito con el ID: ${cartId} no existe`);
      return {}
    } else {
      return cart;
    }
  }

  async getAllCarts() {
    try {
      const allCarts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(allCarts);
    } catch (error) {
      return [];
    }
  }


  async addCart() {
    const carts = await this.getAllCarts();

    const newCart = {
      products: [],
      id: await this.updateCartId(carts),
    };
    const updateCarts = [...carts, newCart];
    await fs.promises.writeFile(this.path, JSON.stringify(updateCarts));
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

    await fs.promises.writeFile(this.path, JSON.stringify(allCarts))
    return cartById;

  }

}

export default CartManager;

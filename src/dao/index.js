import FileProductsManager from "./file-managers/products.managers.js";
import FileCartManager from "./file-managers/cart.managers.js";
import DbProductsManager from "./db-managers/products.managers.js";
import DbCartManager from "./db-managers/cart.managers.js";
import DbChatManager from "./db-managers/chat.managers.js";

const config = {
   presistenceType :"db",
};
let ProductsManager, CartManager, ChatManager;



if(config.presistenceType === "db"){
    ProductsManager = DbProductsManager;
    CartManager = DbCartManager;
    ChatManager = DbChatManager;
}else if(config.presistenceType === "file"){
    ProductsManager = FileProductsManager;
    CartManager = FileCartManager;
    ChatManager = DbChatManager;
}else{
    console.log("Unknown persistence type")
}

export {  ProductsManager, CartManager, ChatManager };
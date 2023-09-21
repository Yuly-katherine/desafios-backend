import chatModel from "../models/schema.chat.js";


class chatManager {

  async addInteraction(message, username) {
   
    if (!message) {
      return console.error(
        `No se ha ningún ingresado mensaje`
      );
    } else {
      const newInteraction= {
        message,
        username:username || "Undefined"
      };
      const result = await chatModel.create(newInteraction);
      return result;
    }
  }

  async getAllInteractions() {
    const interactions = await chatModel.find().lean();
    if(interactions){
        return interactions
    }
      return []
  }

}


export default chatManager;

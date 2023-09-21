import { Router } from 'express';
import { ChatManager } from '../dao/index.js'

const router = Router();
const chatManager = new ChatManager();

router.get('/', async(req, res) => {
    const allInteractions = await chatManager.getAllInteractions()
    res.status(201).send({ result: "success", payload: allInteractions });
})


router.post('/', async(req, res) => {
    const {message, username} = req.body;
    const chatProperties = {message, username }
    const addInteraction = await chatManager.addInteraction(chatProperties)
    res.status(201).send({ result: "success", payload: addInteraction });
});


export default router;
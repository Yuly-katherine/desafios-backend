import express from 'express';

const router = express.Router();

router.get('/', (req, res)=>{
    let testUser = {
        name: "Yuly"
    }
    res.render('home',{
        user:testUser,
        style: 'index.css',
    })
})

router.get('/', (req, res)=>{
    let testUser = {
        name: "Yuly"
    }
    res.render('realTimeProducts',{
        user:testUser,
        style: 'index.css',
    })
})
export default router;
const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/signin',(req,res) => {
    return res.render('signin');
})

router.get('/signup',async (req,res) => {
    const {fullName, email, password} = req.body;
    await User.create({fullName, email, password});
    return res.redirect('/');
})

router.post('/signin',async (req,res) => {
    const {email, password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken({email, password});

        return res.cookie("token",token).redirect('/')
    } catch(error){
        return res.render('signin',{
            error: "Incorrent Email or password",
        })
    }
})

router.get('/logout',(req,res) => {
    res.clearCookie("token").redirect('/');
})

router.post("/signup",async (req,res) => {
    const {fullName, email, password} = req.body
    await User.create({
        fullName,
        email,
        password
    })
})

module.exports = router;
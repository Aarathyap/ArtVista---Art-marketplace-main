const express = require('express');
const router = express.Router();
const User = require("../models/UserModel");
const Work = require("../models/WorkModel");



router.post("/order", async(req, res)=> {
    try {
        const { cart, userId, subtotal } = req.body;
        const orderItems = cart;
        const amountPaid = subtotal;
        const orderData = {
            user: userId,
            orderItems,
            amountPaid
          }
        const user = await User.findById(userId);
        user.cart = []
          user.orders.push(orderData)
         const savedUser =  await user.save();
         res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;
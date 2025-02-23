const express = require('express');
const router = express.Router();

const stripe = require("stripe")(process.env.PUBLIC_STRIPE_SECRET_KEY)

router.post("/stripe", async (req, res) => {
  try {
    const { cart } = await req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart?.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              metadata: {
                productId: item.WorkId
              }
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        }
      }),
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cart",
    })
    res.status(200).json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})


module.exports  = router
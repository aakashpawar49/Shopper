const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/stripe/create-checkout-session', async (req, res) => {
    try {
      const { items } = req.body; // Get items from the request body

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items are required and must be a non-empty array' });
      }

      const line_items = items.map(item => {
        if (!item.name || !item.price || !item.quantity) {
          throw new Error('Each item must have name, price, and quantity');
        }
        if (typeof item.price !== 'number' || item.price <= 0) {
          throw new Error('Price must be a positive number');
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          throw new Error('Quantity must be a positive number');
        }
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      });
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });
  
      // Send back session ID to the frontend
      res.json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;

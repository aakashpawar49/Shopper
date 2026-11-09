const express = require('express');
const Stripe = require('stripe');

const router = express.Router();

// Create the Stripe client lazily so the server can start without Stripe configured.
// Only the payment endpoints need STRIPE_SECRET_KEY.
let stripeClient = null;
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set. Add it to backend/.env to enable payments.');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

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

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        // Both URLs must point at routes that exist in the frontend
        success_url: `${frontendUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/checkout`,
      });

      // Stripe.js v7 removed redirectToCheckout, so the frontend redirects to session.url
      res.json({ id: session.id, url: session.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });


module.exports = router;

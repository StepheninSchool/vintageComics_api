import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

// Get all products route
router.get('/all', async (req, res) => {
  try {
    const products = await prisma.product.findMany()
    res.status(200).json(products)
  } catch (error) {
    console.error('Error retrieving products:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving products' })
  }
})

// Get product by ID route
router.get('/:id', async (req, res) => {
  const productId = Number(req.params.id)

  //validate id is a number
  if (!Number.isInteger(productId)) {
    return res
      .status(400)
      .json({ error: 'Invalid product ID. Must be an integer' })
  }

  try {
    const product = await prisma.product.findUnique({
      where: { product_id: Number(productId) }
    })
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ error: 'No product found.' })
    }
  } catch (error) {
    console.error('Error retrieving product by ID:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving product' })
  }
})

// Purchase route
router.post('/purchase', async (req, res) => {
  // To-do: Add logic to handle product purchase
  const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart, invoice_amt, invoice_tax, invoice_total} = req.body;

  // Validate a user is logged in to access the purchase route
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized access.  Please Log-in.' });
    return;
  }

  const { user_id } = req.session.user;

  // Validate the input fields
  if ( !street || !city || !province || !country ||!postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total ){
    return res.status(400).json({ error: 'All fields required to complete purchase'})
  }

  try {
    // Parse the cart string, convert to array and count product quantities
    const cartItems = cart.split(',').map(Number); // convert to array of numbers
    const productQuantity = {};

    cartItems.forEach((productId) => {
      if (!productQuantity[productId]){
        productQuantity[productId] = 0;
      }
      productQuantity[productId]++;
    });


    //create a new Purchase record 
    const purchase = await prisma.purchase.create({
      data: {
        customer_id: user_id,
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        invoice_amt,
        invoice_tax,
        invoice_total,
        order_date: new Date()
      }
    });
    // Insert into PurchaseItem table for each product in the cart
    const purchaseItems = Object.entries(productQuantity).map(([product_id, quantity]) => ({
      purchase_id: purchase.purchase_id,
      product_id: parseInt(product_id, 10),
      quantity
    }));

    await prisma.purchaseItem.createMany({
      data: purchaseItems
    });

    // Return success Messages
    res.status(201).json({ message: 'Purchase completed successfully!', purchaseItems });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({ error: 'An error occurred while processing your purchase. Please try again.' });
  }
});

export default router

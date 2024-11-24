import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

// GET All Products Route
router.get('/all', async (req, res) => {
  try {
    // SOURCE : https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    const products = await prisma.product.findMany() 
    res.status(200).json(products) 
  } catch (error) {
    console.error('Error retrieving products:', error)
    res.status(500).json({ error: 'An error occurred while retrieving products' }) 
  }
})

// GET Product by ID Route
router.get('/:id', async (req, res) => {

  // Convert ID from params to a number
  const productId = Number(req.params.id) 

  // Validate that the ID is a valid integer
  if (!Number.isInteger(productId)) {
    return res
      .status(400)
      .json({ error: 'Invalid product ID. Must be an integer' })  
  }

  try {
    // Find product by its unique ID
    const product = await prisma.product.findUnique({
      where: { product_id: Number(productId) }  
    })
    if (product) {
      // Return the found product
      res.status(200).json(product) 
    } else {
      // Handle case where product does not exist
      res.status(404).json({ error: 'No product found.' }) 
    }
  } catch (error) {
    console.error('Error retrieving product by ID:', error)
    // Handle unexpected errors
    res.status(500).json({ error: 'An error occurred while retrieving product' }) 
  }
})

// PURCHASE Product Route
router.post('/purchase', async (req, res) => {

  const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart, invoice_amt, invoice_tax, invoice_total } = req.body
  
  // Ensure the user is logged in to make a purchase
  if ( !req.session.user || !req.session.user.id  ) {
    res.status(401).json({ error: 'Unauthorized access.' })
    return
  }

  
  // Extract user ID from the session
  const { user_id } = req.session.user

  // Validate that all required fields are present
  if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total) {
    return res.status(400).json({ error: 'All fields required to complete purchase' }) 
  }

  try {
    // Parse the cart to get product IDs and their quantities
    const cartItems = cart.split(',').map(Number) 
    const productQuantity = {} 

    // Count each product in the cart
    cartItems.forEach((productId) => {
      if (!productQuantity[productId]) {
        productQuantity[productId] = 0
      }
      productQuantity[productId]++
    })

    // Create a new purchase record in the database
    // SOURCE : https://www.prisma.io/docs/orm/reference/prisma-client-reference#create-1
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
    }) 

    // Prepare purchase items to be inserted into database
    const purchaseItems = Object.entries(productQuantity).map(([product_id, quantity]) => ({
      purchase_id: purchase.purchase_id, 
      // SOURCE : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
      product_id: parseInt(product_id, 10),
      quantity 
    }))

    // Insert all purchase items into the database
    // SOURCE : https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    await prisma.purchaseItem.createMany({
      data: purchaseItems
    })  

    // Return success message along with purchase items
    res.status(201).json({ message: 'Purchase completed successfully!', purchaseItems })
  } catch (error) {
    console.error('Error completing purchase:', error)
    res.status(500).json({ error: 'An error occurred while processing your purchase. Please try again.' }) // Handle unexpected errors
  }
})

export default router

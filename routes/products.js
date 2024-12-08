import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()
// Find all products
router.get('/all', async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json(products); // Send products with `image_filename`
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'An error occurred while retrieving products' });
  }
});

// Find product by ID
router.get('/:id', async (req, res) => {
  const productId = Number(req.params.id);

  // Validate product ID
  if (!Number.isInteger(productId)) {
    return res.status(400).json({ error: 'Invalid product ID. Must be an integer.' });
  }

  try {
    const baseURL = 'http://localhost:5000/images/';
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
    });

    if (product) {
      const productWithImage = {
        ...product,
        image_url: `${baseURL}${product.image_filename}`, // Dynamically generate image URL
      };
      res.status(200).json(productWithImage);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the product.' });
  }
});


// PURCHASE Product Route
router.post('/purchase', async (req, res) => {
  const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please login to proceed.' });
  }

  if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart) {
    return res.status(400).json({ error: 'All fields are required for purchase.' });
  }

  try {
    const userId = req.session.user.user_id;

    const purchase = await prisma.purchase.create({
      data: {
        customer_id: userId,
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        order_date: new Date(),
      },
    });

    res.status(201).json({ message: 'Purchase successful!', purchase });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'An error occurred while processing your purchase.' });
  }
});


export default router

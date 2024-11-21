import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all products route
router.get('/all', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'An error occurred while retrieving products' });
  }
});

// Get product by ID route
router.get('/:id', async (req, res) => {
  const productId = Number(req.params.id);

  //validate id is a number
  if (!Number.isInteger(productId)){
    return res.status(400).json({error: 'Invalid product ID. Must be an integer'});
  }

  try {
    const product = await prisma.product.findUnique({
      where: { product_id: Number(productId) },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'No product found.' });
    }
  } catch (error) {
    console.error('Error retrieving product by ID:', error);
    res.status(500).json({ error: 'An error occurred while retrieving product' });
  }
});

// Purchase route
router.post('/purchase', (req, res) => {
  // To-do: Add logic to handle product purchase
  res.send('Purchase completed');
});

export default router;

const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // Check for blank fields
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
});

module.exports = router;

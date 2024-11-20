import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  //altered try-catch to directly query the database, per Michael's suggestion.
  try {
    // Check if the email already exists in the database
    const existingUser = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If a user with the same email exists, return a 400 error
      return res.status(400).json({ error: 'Email already in use' });
    }

    // If the email does not exist, proceed with creating the new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.customer.create({
      data: { email, password: hashedPassword, first_name, last_name },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.customer.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while trying to log in' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'User logged out successfully' });
});

// Get user session route
router.get('/getSession', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({ session: req.session.user });
  } else {
    res.status(401).json({ error: 'No active session' });
  }
});

export default router;

import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import '../Utilities/passwordSchema.js';
import passwordSchema from '../Utilities/passwordSchema.js';

const router = express.Router();
const prisma = new PrismaClient();




// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Define custom error messages for each policy rule
  const passwordErrorMessages = {
    min: 'Password must be a minimum of 8 characters long',
    uppercase: 'Password must contain alteast 1 uppercase character',
    lowercase: 'Password must contain atleasat 1 lowercase character',
    digits: 'Password must contain atleast one number',
  };
  
  // Validate the password against the schema and if invalid, return a list of failed rules
  const passwordErrors = passwordSchema.validate(password, {list: true});

  // Map the failed validation rules to the custom error messages
  const detailedErrors = passwordErrors.map(error => passwordErrorMessages[error]);
  
  // If any policy rule fails, return the failed rules as json
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      error: 'Password does not meet the requirements',
      details: detailedErrors,
    });
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

  // get user inputs
  const { email, password } = req.body;

  // validate the inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // find user in database
  try {
    const user = await prisma.customer.findUnique({ where: { email } });

    // validate user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // validate the password entered is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Setup session
    req.session.email = user.email;
    req.session.user_id = user.customer_id; 
    req.session.name = user.first_name + user.last_name;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;
    req.session.user = { email: user.email, user_id: user.customer_id,first_name: user.first_name, last_name: user.last_name, };
    // req.session.user = { email: user.email, user_id: user.customer_id,name: user.first_name +  ' ' + user.last_name, };
    console.log('Logged in user: ' + req.session.email);


    //send response
    res.status(200).json({ message: 'Login successful', email: user.email });
    console.log('Session data after login:', req.session.user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while trying to log in' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();
  }
  res.status(200).json({ message: 'User logged out successfully'});
});

// Get user session route
router.get('/getSession', (req, res) => {
  //return values in session for logged in user
  if(req.session && req.session.user) {
    const {user_id, email, first_name, last_name} = req.session.user;
    // const {user_id, email, name} = req.session.user;
    // return res.status(200).json({user_id, email, name}); // Using name instead of first_name + last_name
    return res.status(200).json({user_id, email, first_name, last_name});
  }
  res.status(401).json({ message: 'Not logged in.'});
});

export default router;

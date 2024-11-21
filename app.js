import express from 'express';
import session from 'express-station';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRoute from './routes/users.js';
import productsRoute from './routes/products.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Cors configuration
app.use(cors({credentials: true,}));

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key'
}))
// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Define routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

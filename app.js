import express from 'express'
import session from 'express-session'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import usersRoute from './routes/users.js'
import productsRoute from './routes/products.js'

const app = express()
const PORT = process.env.PORT || 5000

// Cors configuration
app.use(cors({ credentials: true }))

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// Cors Middleware
app.use(
  cors({
    // origin: 'http://localhost:5000',
    credentials: true, //allows cookies, allowing login session to be stored.
  })
)

// Express-session Middleware
app.use(
  session({
    secret: 'jfknunlar834fFJFJSKhyv46',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000 // 1 hour
    }
  })
)

// Define routes
app.use('/users', usersRoute)
app.use('/products', productsRoute)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

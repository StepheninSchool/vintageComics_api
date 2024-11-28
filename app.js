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
// SOURCE : https://www.npmjs.com/package/cors#configuring-cors
const corsOptions = {
  credentials: true, //allows cookies, allowing login session to be stored.
  //origin: 'http://localhost:5173',
}

// Resolve directory paths for ES Modules
// SOURCE - https://nodejs.org/api/esm.html#importmetaurl
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(express.static('public'));

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

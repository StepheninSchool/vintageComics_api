import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_HOST

export default function Home () {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts () {
      try {
        const response = await fetch(`${apiUrl}/products/all`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className='container'>
      <h1 className='text-center my-4 p-1 shadow-lg'>The Gallery</h1>
      <div className='row'>
        {products.map(product => (
          <div key={product.product_id} className='col-md-3 mb-4'>
            <div className='card h-100 shadow'>
              {/* Removed "view details" button and made the image itself clickable for a cleaner look. */}
              <Link to={`/details/${product.product_id}`}>
                <img
                  src={`${apiUrl}/images/${product.image_filename}`}
                  alt={product.name}
                  className='card-img-top img-fluid'
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              </Link>
              {/* Rest of the card remains static */}
              <div className='card-body d-flex flex-column justify-content-between'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text fw-bold'>$
                  <span className='text-success'>
                    {/* Format price with commas and 2 decimal places */}
                    {Number(product.cost).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
      <h1 className='text-center my-4'>The Gallery</h1>
      <div className='row'>
        {products.map(product => (
          <div
            key={product.product_id}
            className='col-sm-6 col-md-4 col-lg-3 mb-4'
          >
            <div className='card h-100 shadow'>
              <div className='overflow-hidden' style={{ height: '150px' }}>
                <img
                  src={`${apiUrl}/images/${product.image_filename}`}
                  alt={product.name}
                  className='card-img-top'
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div className='card-body text-center'>
                <h6 className='card-title'>{product.name}</h6>
                <p className='card-text text-success fw-bold'>
                  {/* SOURCE: https://www.w3schools.com/jsref/jsref_tolocalestring.asp  Using commas in number with decimals.*/}
                  $
                  {product.cost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <Link
                  to={`/details/${product.product_id}`}
                  className='btn btn-primary rounded-pill mt-2'
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Home() {
  const [products, setProducts] = useState([]); // Store product details

  // Fetch all products on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${apiUrl}/products/all`); // API endpoint for all products
        const data = await response.json();
        setProducts(data); // Store fetched product data
      } catch (error) {
        console.error('Error fetching products:', error); // Log any errors
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="container my-5">
      <div className="bg-light p-4 rounded shadow-lg">
        {/* Header for the gallery */}
        <h1 className="text-center display-4 text-primary mb-4">The Gallery</h1>
        <div className="row">
          {/* Loop through all products and display them */}
          {products.map((product) => (
            <div key={product.product_id} className="col-md-3 mb-4">
              <div className="card h-100 shadow">
                {/* Make the image clickable to navigate to details */}
                <Link to={`/details/${product.product_id}`} className="text-decoration-none">
                  <img
                    src={`${apiUrl}/images/${product.image_filename}`} // Dynamic image URL
                    alt={product.name}
                    className="card-img-top img-fluid rounded"
                    style={{ height: '200px', objectFit: 'cover' }} // Consistent image size
                  />
                </Link>
                <div className="card-body d-flex flex-column justify-content-between">
                  {/* Product Name */}
                  <h5 className="card-title text-dark text-center">{product.name}</h5>
                  {/* Product Price */}
                  <p className="card-text text-center fw-bold">
                    Price: $
                    <span className="text-success">
                      {/* Format price with commas and 2 decimal places */}
                      {Number(product.cost).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                  {/* View Details Link */}
                  <div className="d-flex justify-content-center">
                    <Link
                      to={`/details/${product.product_id}`}
                      className="btn btn-primary rounded-pill mt-3"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

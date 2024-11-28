import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css"; // Ensure your custom CSS is imported

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${apiUrl}/products/all`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">Our Products</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.product_id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={`${apiUrl}/images/${product.image_filename}`} // Construct URL using filename
                alt={product.name}
                className="card-img-top product-image"
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-success">
                  ${product.cost.toFixed(2)}
                </p>
                <Link to={`/details/${product.product_id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

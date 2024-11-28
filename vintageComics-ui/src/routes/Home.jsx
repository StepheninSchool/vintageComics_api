import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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
      <h1 className="text-center my-4">Our Products</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.product_id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={`${apiUrl}/images/${product.image_filename}`} // Construct URL using filename
                alt={product.name}
                className="card-img-top img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-success fw-bold">
                  ${product.cost.toFixed(2)}
                </p>
                <Link
                  to={`/details/${product.product_id}`}
                  className="btn btn-primary rounded-pill mt-2 align-self-stretch"
                >
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

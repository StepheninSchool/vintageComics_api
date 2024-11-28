import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../index.css";

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // Control alert visibility

  useEffect(() => {
    async function fetchProduct() {
      try {
        const url = `${apiUrl}/products/${id}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError("Product not found.");
        }
      } catch (error) {
        setError("Error fetching product data.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <div className="container my-5">
      <Link to="/home" className="btn btn-outline-secondary mb-3">Go Back</Link>
      <div className="bg-light p-4 rounded shadow-lg">
        <h1 className="text-center display-4 text-primary mb-4">Comic #{product.product_id}</h1>
        {product && (
          <div className="row">
            <div className="col-md-6">
              <h2 className="text-secondary">{product.name}</h2>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> ${product.cost.toFixed(2)}</p>
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowAlert(true); // Show the alert
                  setTimeout(() => setShowAlert(false), 2000); // Auto-hide after 2 seconds
                }}
              >
                Add to Cart
              </button>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={`${product.name} cover`}
                  className="product-image img-fluid rounded shadow"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Centered Bootstrap Alert */}
      {showAlert && (
        <div className="alert alert-success alert-center" role="alert">
          Product added to cart!
        </div>
      )}
    </div>
  );
}

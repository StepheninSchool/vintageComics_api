import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Details() {
  const { id } = useParams(); // Retrieve product ID from URL
  const [product, setProduct] = useState(null); // State to hold product details
  const [loading, setLoading] = useState(true); // State for tracking loading status
  const [error, setError] = useState(null); // State to track errors
  const [cookies, setCookie] = useCookies(["cart"]); // Manage cart cookie

  // Fetch product data on component mount or when ID changes
  useEffect(() => {
    async function fetchProduct() {
      try {
        const url = `${apiUrl}/products/${id}`; // Fetch product by ID
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setProduct(data); // Set product data on successful fetch
        } else {
          setError("Product not found."); // Handle case where product is not found
        }
      } catch (error) {
        setError("Error fetching product data."); // Handle fetch errors
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    }
    fetchProduct();
  }, [id]);

  // Add product to cart
  const addToCart = (productId) => {
    // Ensure `cookies.cart` is a valid string and split it into an array
    const currentCart = cookies.cart ? String(cookies.cart).split(",") : [];
    console.log("Current Cart (Before Adding):", currentCart);
  
    // Add the new product ID to the cart
    currentCart.push(productId.toString());
  
    // Update the cookie with the updated cart
    setCookie("cart", currentCart.join(","), { path: "/", maxAge: 30 * 24 * 60 * 60 }); // 30 days expiry
    console.log("Updated Cart Cookie:", currentCart);
  
    // Notify the user
    alert("Product added to cart!");
  };
  

  // Handle loading state
  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  // Render product details if `product` is successfully loaded
  return (
    <div className="container my-5">
      <Link to="/home" className="btn btn-outline-secondary mb-3">
        Go Back
      </Link>

      <div className="bg-light p-4 rounded shadow-lg">
        <h1 className="text-center display-4 text-primary mb-4">
          Comic #{product.product_id}
        </h1>

        {product && (
          <div className="row">
            <div className="col-md-6">
              <h2 className="text-secondary">{product.name}</h2>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Price:</strong> ${product.cost.toFixed(2)}
              </p>
              <button
                className="btn btn-success w-100"
                onClick={() => addToCart(product.product_id)}
              >
                Add to Cart
              </button>
            </div>

            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <img
                src={`${apiUrl}/images/${product.image_filename}`} // Dynamically generated image URL
                alt={`${product.name} cover`}
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Cart() {
  const [cookies] = useCookies(["cart"]); // Access cart cookie
  const [cartItems, setCartItems] = useState([]); // Hold product details with quantities
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const productIds = cookies.cart ? cookies.cart.split(",") : []; // Parse product IDs
        const productCount = {}; // Object to count occurrences of each product ID

        // Count product quantities
        productIds.forEach((id) => {
          productCount[id] = (productCount[id] || 0) + 1;
        });

        const uniqueProductIds = [...new Set(productIds)];
        const productsWithQuantities = [];

        // Fetch product details using for...of loop
        for (const id of uniqueProductIds) {
          const response = await fetch(`${apiUrl}/products/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch product details");
          }
          const product = await response.json();
          productsWithQuantities.push({
            ...product,
            quantity: productCount[product.product_id], // Add quantity to each product
          });
        }

        setCartItems(productsWithQuantities); // Update state
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Error fetching cart items. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    }
    fetchCartItems();
  }, [cookies.cart]); // Re-fetch when cart cookie changes

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  };

  // Handle loading and error states
  if (loading) return <p>Loading your cart...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">
          Your cart is empty. <Link to="/">Start shopping!</Link>
        </p>
      ) : (
        <div>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.product_id} className="col-md-12 mb-4">
                <div className="card">
                  <div className="row g-0">
                    {/* Thumbnail */}
                    <div className="col-md-2">
                      <img
                        src={`${apiUrl}/images/${item.image_filename}`}
                        alt={item.name}
                        className="img-fluid rounded-start"
                        style={{ maxHeight: "100px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-10">
                      <div className="card-body d-flex justify-content-between">
                        <div>
                          {/* Product Details */}
                          <h5 className="card-title">{item.name}</h5>
                          <p className="card-text text-success">
                            Price: ${item.cost.toFixed(2)}
                          </p>
                          <p className="card-text">Quantity: {item.quantity}</p>
                          <p className="card-text">
                            Total: ${(item.cost * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Subtotal */}
          <div className="mt-4">
            <h4 className="text-end">Subtotal: ${calculateSubtotal().toFixed(2)}</h4>
          </div>
          {/* Navigation Buttons */}
          <div className="mt-3 d-flex justify-content-between">
            <Link to="/home" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <Link to="/checkout" className="btn btn-primary">
              Complete Purchase
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';


const apiUrl = import.meta.env.VITE_API_HOST;

export default function Cart() {
  const [cookies, setCookie, removeCookie] = useCookies(['cart']); // Manage the cart cookie
  const [cartItems, setCartItems] = useState([]); // Store detailed cart items
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store errors

  // Fetch product details and quantities based on the cart cookie
  useEffect(() => {
    async function fetchCartItems() {
      try {
        // Get product IDs from the cart cookie
        const productIds = cookies.cart ? String(cookies.cart).split(',') : [];
        if (productIds.length === 0) {
          setCartItems([]); // If the cart is empty
          setLoading(false);
          return;
        }

        // Count the occurrences of each product ID
        const productCount = {};
        productIds.forEach((id) => {
          productCount[id] = (productCount[id] || 0) + 1;
        });

        // Fetch unique product details
        const uniqueProductIds = [...new Set(productIds)];
        const productsWithQuantities = [];

        for (const id of uniqueProductIds) {
          const response = await fetch(`${apiUrl}/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          const product = await response.json();
          productsWithQuantities.push({
            ...product,
            quantity: productCount[product.product_id], // Add quantity to product details
          });
        }

        setCartItems(productsWithQuantities); // Update state with fetched products
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items. Please try again.'); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    }
    fetchCartItems();
  }, [cookies.cart]); // Re-fetch when cart cookie changes

  // Add or remove quantities in the cart
  const updateCart = (productId, increment) => {
    const currentCart = cookies.cart ? String(cookies.cart).split(',') : [];
    let updatedCart = [...currentCart];

    if (increment) {
      updatedCart.push(productId.toString()); // Add product to cart
    } else {
      const index = updatedCart.indexOf(productId.toString());
      if (index > -1) {
        updatedCart.splice(index, 1); // Remove one instance of the product
      }
    }

    // If cart is empty, remove the cookie, otherwise update it
    if (updatedCart.length === 0) {
      removeCookie('cart', { path: '/' });
    } else {
      setCookie('cart', updatedCart.join(','), { path: '/', maxAge: 3600000 }); // Update cookie
    }
  };

  // Remove all instances of a product from the cart
  const removeItem = (productId) => {
    const currentCart = cookies.cart ? String(cookies.cart).split(',') : [];
    const updatedCart = currentCart.filter((id) => id !== productId.toString());

    // If cart is empty, remove the cookie, otherwise update it
    if (updatedCart.length === 0) {
      removeCookie('cart', { path: '/' });
    } else {
      setCookie('cart', updatedCart.join(','), { path: '/', maxAge: 3600000 });
    }
  };

  // Calculate subtotal by summing up (price * quantity) for all products
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.cost * item.quantity, 0);
  };

  // Calculate tax (15% of the subtotal)
  const calculateTax = (subtotal) => {
    return subtotal * 0.15;
  };

  // Calculate total cost (subtotal + tax)
  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };

  // Handle loading and error states
  if (loading) return <p className="text-center">Loading your cart...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  // Calculate totals for display
  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  return (
    <div className="container my-5">
      <div className="bg-light p-4 rounded shadow-lg">
        <h1 className="text-center display-4 text-primary mb-4">Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          // If cart is empty, show a message with a link to shop
          <p className="text-center">
            Your cart is empty. <Link to="/home">Start shopping!</Link>
          </p>
        ) : (
          <div>
            <div className="row">
              {cartItems.map((item) => (
                <div key={item.product_id} className="col-12 mb-4">
                  <div className="card shadow-sm">
                    <div className="row g-0 align-items-center">
                      {/* Product Image */}
                      <div className="col-md-3 d-flex justify-content-center align-items-center">
                        <img
                          src={`${apiUrl}/images/${item.image_filename}`}
                          alt={item.name}
                          className="img-fluid rounded shadow-lg mt-2"
                          style={{ maxHeight: '100px', objectFit: 'cover' }}
                        />
                      </div>
                      {/* Product Details */}
                      <div className="col-md-9">
                        <div className="card-body d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">{item.name}</h5>
                            <p>
                              Price: $
                              {item.cost.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p>Quantity: {item.quantity}</p>
                            {/* Quantity Controls */}
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => updateCart(item.product_id, true)}
                              >
                                +
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => updateCart(item.product_id, false)}
                              >
                                -
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeItem(item.product_id)}
                              >
                                X
                              </button>
                            </div>
                          </div>
                          <p>
                            Total: $
                            {(item.cost * item.quantity).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Subtotals and Actions */}
            <div className="mt-4">
              <h4>
                Subtotal: $
                {subtotal.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h4>
              <h5>
                Tax: $
                {tax.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h5>
              <h3>
                Total: $
                {total.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
            {/* Navigation buttons */}
            <div className="mt-3 d-flex justify-content-between">
              <Link to="/home" className="btn btn-secondary">
                Continue Shopping
              </Link>
              <Link to="/checkout" className="btn btn-primary">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

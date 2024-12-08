import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Checkout() {
  const { isLoggedIn } = useOutletContext(); // Access isLoggedIn context
  const [cookies, setCookie] = useCookies(['cart']); // Access cart cookie
  const [cartItems, setCartItems] = useState([]); // Store cart items
  const [loading, setLoading] = useState(true); // Loading state for cart items
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Restrict access if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning text-center">
          <p>You must be logged in to proceed to checkout.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Fetch cart items
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const productIds = cookies.cart ? String(cookies.cart).split(',') : [];
        if (productIds.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const productCount = {};
        productIds.forEach(id => {
          productCount[id] = (productCount[id] || 0) + 1;
        });

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
            quantity: productCount[product.product_id],
          });
        }

        setCartItems(productsWithQuantities);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, [cookies.cart]);

  // Submit handler for the checkout form
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/products/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          cart: cookies.cart, // Include cart from cookies
        }),
      });

      if (response.ok) {
        // Clear the cart and navigate to confirmation
        setCookie('cart', '', { path: '/' }); // Clear the cart
        navigate('/confirmation'); // Redirect to confirmation page
      } else {
        const errorData = await response.json();
        console.error("Failed to process purchase:", errorData.error || 'Unknown error');
      }
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  };

  // Calculate tax and total
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="container my-5">
      <div className="bg-light p-4 rounded shadow-lg">
        <h1 className="text-center display-4 text-primary mb-4">Checkout</h1>

        {/* Cart Summary */}
        {loading ? (
          <p>Loading cart items...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="mb-4">
            <h4>Your Order Summary</h4>
            <ul className="list-group">
              {cartItems.map(item => (
                <li key={item.product_id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.name}</strong> <br />
                    Quantity: {item.quantity}
                  </div>
                  <div>
                    ${Number(item.cost * item.quantity).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
              <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
              <p><strong>Total:</strong> ${total.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-4" style={{ maxWidth: '400px' }}>
          {/* Street Address */}
          <div className="mb-3">
            <label htmlFor="street" className="form-label">Street</label>
            <input
              id="street"
              className={`form-control ${errors.street ? "is-invalid" : ""}`}
              {...register("street", { required: "Street is required" })}
            />
            {errors.street && <div className="invalid-feedback">{errors.street.message}</div>}
          </div>

          {/* City */}
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <input
              id="city"
              className={`form-control ${errors.city ? "is-invalid" : ""}`}
              {...register("city", { required: "City is required" })}
            />
            {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
          </div>

          {/* Province */}
          <div className="mb-3">
            <label htmlFor="province" className="form-label">Province</label>
            <input
              id="province"
              className={`form-control ${errors.province ? "is-invalid" : ""}`}
              {...register("province", { required: "Province is required" })}
            />
            {errors.province && <div className="invalid-feedback">{errors.province.message}</div>}
          </div>

          {/* Country */}
          <div className="mb-3">
            <label htmlFor="country" className="form-label">Country</label>
            <input
              id="country"
              className={`form-control ${errors.country ? "is-invalid" : ""}`}
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && <div className="invalid-feedback">{errors.country.message}</div>}
          </div>

          {/* Postal Code */}
          <div className="mb-3">
            <label htmlFor="postal_code" className="form-label">Postal Code</label>
            <input
              id="postal_code"
              className={`form-control ${errors.postal_code ? "is-invalid" : ""}`}
              {...register("postal_code", { required: "Postal Code is required" })}
            />
            {errors.postal_code && <div className="invalid-feedback">{errors.postal_code.message}</div>}
          </div>

          {/* Credit Card */}
          <div className="mb-3">
            <label htmlFor="credit_card" className="form-label">Credit Card</label>
            <input
              id="credit_card"
              className={`form-control ${errors.credit_card ? "is-invalid" : ""}`}
              {...register("credit_card", { required: "Credit Card is required" })}
            />
            {errors.credit_card && <div className="invalid-feedback">{errors.credit_card.message}</div>}
          </div>

          {/* Credit Expiry */}
          <div className="mb-3">
            <label htmlFor="credit_expire" className="form-label">Credit Expiry (MM/YY)</label>
            <input
              id="credit_expire"
              className={`form-control ${errors.credit_expire ? "is-invalid" : ""}`}
              {...register("credit_expire", { required: "Credit Expiry is required" })}
            />
            {errors.credit_expire && <div className="invalid-feedback">{errors.credit_expire.message}</div>}
          </div>

          {/* CVV */}
          <div className="mb-3">
            <label htmlFor="credit_cvv" className="form-label">CVV</label>
            <input
              id="credit_cvv"
              className={`form-control ${errors.credit_cvv ? "is-invalid" : ""}`}
              {...register("credit_cvv", { required: "CVV is required" })}
            />
            {errors.credit_cvv && <div className="invalid-feedback">{errors.credit_cvv.message}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary rounded-pill w-100">Complete Purchase</button>
        </form>
      </div>
    </div>
  );
}

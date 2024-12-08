import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Checkout() {
  const { isLoggedIn } = useOutletContext(); // Access isLoggedIn context
  const [cookies, setCookie] = useCookies(['cart']); // Access cart cookie
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

  // Check if the cart is empty
  if (!cookies.cart || cookies.cart.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-info text-center">
          <p>Your cart is empty. Please add items to your cart before proceeding to checkout.</p>
          <Link to="/home" className="btn btn-secondary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="container my-5">
      <div className="bg-light p-4 rounded shadow-lg">
        <h1 className="text-center display-4 text-primary mb-4">Checkout</h1>
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

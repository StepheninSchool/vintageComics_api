import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useOutletContext } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Login() {
  const { setIsLoggedIn } = useOutletContext(); // Access the state updater
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [cookies] = useCookies(['cart']); // Access the cart cookie
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(true);

        // Check if there are items in the cart
        const cartItems = cookies.cart ? cookies.cart.split(",") : [];
        if (cartItems.length > 0) {
          navigate("/cart"); // Redirect to checkout if cart has items
        } else {
          navigate("/home"); // Otherwise, redirect to home
        }
      } else {
        const errorData = await response.json();
        setServerError(errorData.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setServerError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light p-5 rounded shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 className="text-center mb-4 text-primary">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 rounded-pill mb-3">Login</button>

          {/* Signup Link */}
          <div className="text-center">
            Don’t have an account? <a href="/signup" className="text-primary">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

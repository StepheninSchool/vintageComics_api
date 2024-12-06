import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const apiUrl = import.meta.env.VITE_API_HOST; // API base URL

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // React Hook Form setup
  const [serverError, setServerError] = useState(""); // State to store server error messages
  const navigate = useNavigate(); // Navigation hook

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        navigate("/home"); // Redirect to home page
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
    <div className="container my-5">
      <div className="bg-light p-4 rounded shadow-lg">
        <h1 className="text-center display-4 text-primary mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Input */}
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
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Display server-side error */}
          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}

          {/* Submit Button */}
          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-primary">
              Login
            </button>

            {/* Signup Link */}
            <div className="text-center mt-4">
            <span>Don't have an account?</span>
            <Link to="/signup" className="btn btn-link">
              Sign up now!
            </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

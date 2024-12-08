import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { passwordSchema } from "../Utilities/passwordSchema.js";

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState(""); // Manage server-side errors
  const [passwordErrors, setPasswordErrors] = useState([]); // Handle password-specific errors
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError(""); // Reset errors
    setPasswordErrors([]); // Reset password validation errors

    try {
      const response = await fetch(`${apiUrl}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.details) {
          setPasswordErrors(errorData.details);
        } else {
          setServerError(errorData.error || "Signup failed. Please try again.");
        }
      } else {
        // On success, redirect to login
        navigate("/login");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light p-5 rounded shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 className="text-center mb-4 text-primary">Sign Up</h1>
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
              placeholder="Create a password"
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

          {/* Password Errors */}
          {passwordErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {passwordErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* First Name Field */}
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
              placeholder="Enter your first name"
              {...register("first_name", {
                required: "First name is required",
              })}
            />
            {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
          </div>

          {/* Last Name Field */}
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              placeholder="Enter your last name"
              {...register("last_name", {
                required: "Last name is required",
              })}
            />
            {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
          </div>

          {/* Server Error Display */}
          {serverError && (
            <div className="alert alert-danger text-center" role="alert">
              {serverError}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 rounded-pill mb-3">
            Sign Up
          </button>

          {/* Login Link */}
          <div className="text-center">
            Already have an account? <a href="/login" className="text-primary">Log In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

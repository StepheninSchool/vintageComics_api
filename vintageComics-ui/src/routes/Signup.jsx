import React, { useState } from "react";
import { useForm } from "react-hook-form"; // For form handling and validation
import { useNavigate } from "react-router-dom"; // For navigation


const apiUrl = import.meta.env.VITE_API_HOST; // Base API URL from environment variables

export default function Signup() {
  const {
    register, // For registering form fields
    handleSubmit, // To handle form submission
    formState: { errors }, // To access form validation errors
  } = useForm();

  const [serverError, setServerError] = useState(""); // Manage errors from the server
  const [passwordErrors, setPasswordErrors] = useState([]); // Manage specific password validation errors
  const navigate = useNavigate(); // Used to redirect users to another route

  // Form submission handler
  const onSubmit = async (data) => {
    // Reset previous errors
    setServerError("");
    setPasswordErrors([]);

    try {
      // Make a POST request to the signup API
      const response = await fetch(`${apiUrl}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Send form data as JSON
      });

      if (!response.ok) {
        // Handle server-side validation errors
        const errorData = await response.json();
        if (errorData.details) {
          // If password validation failed, set detailed errors
          setPasswordErrors(errorData.details);
        } else {
          // Handle generic server error
          setServerError(errorData.error || "Signup failed. Please try again.");
        }
      } else {
        // Redirect user to login page upon successful signup
        navigate("/login");
      }
    } catch (error) {
      // Handle network or unexpected errors
      setServerError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light p-5 rounded shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Signup Page Header */}
        <h1 className="text-center mb-4 text-primary">Sign Up</h1>

        {/* Signup Form */}
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
                required: "Email is required", // Client-side validation: required field
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email pattern
                  message: "Enter a valid email address", // Validation message
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
                required: "Password is required", // Client-side validation: required field
                minLength: {
                  value: 8, // Minimum password length
                  message: "Password must be at least 8 characters", // Validation message
                },
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          {/* Password Validation Errors */}
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
                required: "First name is required", // Validation for required field
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
                required: "Last name is required", // Validation for required field
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

          {/* Redirect to Login Link */}
          <div className="text-center">
            Already have an account? <a href="/login" className="text-primary">Log In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

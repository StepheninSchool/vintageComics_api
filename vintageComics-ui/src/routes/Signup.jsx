import { useForm } from "react-hook-form"; // Form validation
import { useState } from "react"; // Manage error states
import { useNavigate } from "react-router-dom"; // For navigation

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Signup() {
  const {
    register, // Register input fields
    handleSubmit, // Handle form submission
    formState: { errors }, // Access validation errors
  } = useForm();
  const [serverError, setServerError] = useState(""); // Manage server-side errors
  const [passwordErrors, setPasswordErrors] = useState([]); // Manage password-specific errors
  const navigate = useNavigate(); // Redirect on success

  // Submit form data to the API
  const onSubmit = async (data) => {
    setServerError(""); // Reset error messages
    setPasswordErrors([]); // Reset password-specific errors

    try {
      const response = await fetch(`${apiUrl}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.details) {
          // Handle detailed password errors
          setPasswordErrors(errorData.details);
        } else {
          // Handle other server errors
          setServerError(errorData.error || "Signup failed. Please try again.");
        }
      } else {
        // On successful signup, redirect to login page
        navigate("/login");
      }
    } catch (error) {
      // Handle unexpected errors
      setServerError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Signup</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-4"
        style={{ maxWidth: "400px" }}
      >
        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        {/* Display API Password Errors */}
        {passwordErrors.length > 0 && (
          <div className="alert alert-danger">
            <ul>
              {passwordErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* First Name */}
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            className={`form-control ${
              errors.first_name ? "is-invalid" : ""
            }`}
            {...register("first_name", {
              required: "First name is required",
            })}
          />
          {errors.first_name && (
            <div className="invalid-feedback">{errors.first_name.message}</div>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            className={`form-control ${
              errors.last_name ? "is-invalid" : ""
            }`}
            {...register("last_name", {
              required: "Last name is required",
            })}
          />
          {errors.last_name && (
            <div className="invalid-feedback">{errors.last_name.message}</div>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Signup
        </button>
      </form>
    </div>
  );
}

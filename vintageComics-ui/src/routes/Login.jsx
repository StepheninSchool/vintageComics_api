import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Login() {
  const { setIsLoggedIn } = useOutletContext(); // Access the state updater
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(true);
        navigate('/home'); // Redirect after successful login
      } else {
        const errorData = await response.json();
        setServerError(errorData.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setServerError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className={`form-control ${errors.email && 'is-invalid'}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        {/* Password */}
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className={`form-control ${errors.password && 'is-invalid'}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
        {/* Server Error */}
        {serverError && <p className="text-danger">{serverError}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

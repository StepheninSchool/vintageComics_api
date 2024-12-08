import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function Confirmation() {
  const [cookies, setCookie] = useCookies(['cart']); // Access and manage the cart cookie
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart cookie after the purchase is successful
    setCookie('cart', '', { path: '/' });
  }, [setCookie]);

  return (
    <div className="container my-5">
      <div className="bg-light p-4 rounded shadow-lg text-center">
        <h1 className="text-success mb-4">Thank You for Your Purchase!</h1>
        <p className="lead">Your order has been successfully completed.</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate('/home')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Logout() {
  const [message, setMessage] = useState('');
  const setIsLoggedIn = useOutletContext(); // Access setIsLoggedIn
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      try {
        const response = await fetch(`${apiUrl}/users/logout`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          setIsLoggedIn(false); // Update login state
          setMessage('You have been logged out successfully.');
          setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
        } else {
          setMessage('Logout failed. Please try again.');
        }
      } catch (error) {
        setMessage('An error occurred during logout.');
      }
    }

    handleLogout();
  }, [setIsLoggedIn, navigate]);

  return (
    <div className="container">
      <h2>Logout</h2>
      <p>{message}</p>
    </div>
  );
}

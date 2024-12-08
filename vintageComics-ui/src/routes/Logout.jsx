import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Logout() {
  const { setIsLoggedIn } = useOutletContext(); // Access `setIsLoggedIn` from context to update login state
  const [message, setMessage] = useState(''); // State to display logout messages to the user
  const navigate = useNavigate(); // Navigation hook to redirect the user

  // Handle the logout process when the component mounts
  useEffect(() => {
    async function handleLogout() {
      try {
        // Make an API call to the logout endpoint
        const response = await fetch(`${apiUrl}/users/logout`, {
          method: 'POST',
          credentials: 'include', // Include session credentials for logout
        });

        if (response.ok) {
          // If logout is successful, update state and navigate to the login page
          setIsLoggedIn(false); // Set login state to false
          setMessage('You have been logged out successfully.'); // Display success message
          setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
        } else {
          // If logout fails, display an error message
          setMessage('Logout failed. Please try again.');
        }
      } catch (error) {
        // Handle unexpected errors during the logout process
        setMessage('An error occurred during logout.');
      }
    }

    handleLogout(); // Call the logout function
  }, [setIsLoggedIn, navigate]); // Add dependencies to the useEffect hook

  return (
    <div className="container">
      {/* Display a heading and the logout message */}
      <h2>Logout</h2>
      <p>{message}</p>
    </div>
  );
}

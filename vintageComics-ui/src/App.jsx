import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = import.meta.env.VITE_API_HOST;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Check session status on page load
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${apiUrl}/users/getSession`, {
          credentials: 'include', // Send session cookie
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isLoggedIn);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false); // Stop loading
      }
    }

    checkSession();
  }, []);

  if (loading) {
    // Show a loading indicator until session check is complete
    return <p>Loading...</p>;
  }

  return (
    <div className='txt-lg'>
      <h1>Welcome to Vintage Comics</h1>
      <Nav isLoggedIn={isLoggedIn} />
      <Outlet context={setIsLoggedIn} />
    </div>
  );
}

export default App;

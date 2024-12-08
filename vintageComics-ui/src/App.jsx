import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = import.meta.env.VITE_API_HOST;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${apiUrl}/users/getSession`, {
          credentials: 'include', // Include session cookie
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isLoggedIn || false); // Update login state
        } else {
          setIsLoggedIn(false); // Default to logged out
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      }
    }

    checkSession();
  }, []);

  return (
    <div className="app-container">
      <h1 className="text-center my-3">Vintage Comics</h1>
      <Nav isLoggedIn={isLoggedIn} />
      <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
    </div>
  );
}

export default App;

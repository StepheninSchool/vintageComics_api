import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Shopping cart icon

function Nav({ isLoggedIn }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container">
        <Link to="/home" className="navbar-brand">
          Gallery
        </Link>
        <div className="navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    <FaShoppingCart /> Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

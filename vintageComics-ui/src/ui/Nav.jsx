import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCookies } from "react-cookie";

export default function Nav({ isLoggedIn }) {
  const [cookies] = useCookies(["cart"]); // Access the cart cookie
  const [cartCount, setCartCount] = useState(0); // State to hold the cart count

  // Update cart count when the cart cookie changes
  useEffect(() => {
    const cartItems = cookies.cart ? String(cookies.cart).split(",") : [];
    setCartCount(cartItems.length); // Count items in the cart
  }, [cookies.cart]); // Re-run when cart cookie changes

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          HOME
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/cart">
                    <FaShoppingCart /> Cart
                    {/* Display badge only if cart has items */}
                    {cartCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ zIndex: 1050 }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

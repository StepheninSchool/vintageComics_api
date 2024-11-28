import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App';
import Home from './routes/Home';
import Details from './routes/Details';
import Signup from './routes/Signup';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Cart from './routes/Cart';
import Checkout from './routes/Checkout';
import Confirmation from './routes/Confirmation';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "home", element: <Home /> }, // Home page
      { path: "details/:id", element: <Details /> }, // Details page
      { path: "signup", element: <Signup /> }, // Signup page
      { path: "login", element: <Login /> }, // Login page
      { path: "logout", element: <Logout /> }, // Logout page
      { path: "cart", element: <Cart /> }, // Cart page
      { path: "checkout", element: <Checkout /> }, // Checkout page
      { path: "confirmation", element: <Confirmation /> }, // Confirmation page
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

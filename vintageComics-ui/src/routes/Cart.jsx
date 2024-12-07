import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_HOST;

export default function Cart() {
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const productIds = cookies.cart ? String(cookies.cart).split(',') : [];
        if (productIds.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const productCount = {};
        productIds.forEach((id) => {
          productCount[id] = (productCount[id] || 0) + 1;
        });

        const uniqueProductIds = [...new Set(productIds)];
        const productsWithQuantities = [];

        for (const id of uniqueProductIds) {
          const response = await fetch(`${apiUrl}/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          const product = await response.json();
          productsWithQuantities.push({
            ...product,
            quantity: productCount[product.product_id],
          });
        }

        setCartItems(productsWithQuantities);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchCartItems();
  }, [cookies.cart]);

  // Update cart quantities
  const updateCart = (productId, increment) => {
    const currentCart = cookies.cart ? String(cookies.cart).split(',') : [];
    let updatedCart = [...currentCart];

    if (increment) {
      updatedCart.push(productId.toString());
    } else {
      const index = updatedCart.indexOf(productId.toString());
      if (index > -1) {
        updatedCart.splice(index, 1);
      }
    }

    if (updatedCart.length === 0) {
      removeCookie('cart', { path: '/' });
    } else {
      setCookie('cart', updatedCart.join(','), { path: '/', maxAge: 3600000 });
    }
  };

  // Remove product completely
  const removeItem = (productId) => {
    const currentCart = cookies.cart ? String(cookies.cart).split(',') : [];
    const updatedCart = currentCart.filter((id) => id !== productId.toString());

    if (updatedCart.length === 0) {
      removeCookie('cart', { path: '/' });
    } else {
      setCookie('cart', updatedCart.join(','), { path: '/', maxAge: 3600000 });
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.cost * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.15; // Example tax rate: 15%
  };

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };

  // Handle loading and error states
  if (loading) return <p>Loading your cart...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  return (
    <div className="container my-5">
      <h1 className="text-center p-1 shadow">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">
          Your cart is empty. <Link to="/">Start shopping!</Link>
        </p>
      ) : (
        <div>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.product_id} className="col-md-12 mb-4">
                <div className="card">
                <div className="row g-0 align-items-center">
  {/* Thumbnail */}
  <div className="col-3 col-md-2 d-flex justify-content-center align-items-center">
    <img
      src={`${apiUrl}/images/${item.image_filename}`}
      alt={item.name}
      className="img-fluid rounded-start"
      style={{ maxHeight: '100px' }} 
    />
  </div>
  <div className="col-9 col-md-10">
    <div className="card-body d-flex flex-column flex-md-row justify-content-between">
      <div>
        <h5 className="card-title">{item.name}</h5>
        <p>
          Price: $
          {Number(item.cost).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p>Quantity: {item.quantity}</p>
        <div>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => updateCart(item.product_id, true)}
          >
            +
          </button>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => updateCart(item.product_id, false)}
          >
            -
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => removeItem(item.product_id)}
          >
            X
          </button>
        </div>
      </div>
      <p className="mt-2 mt-md-0">
        Total: $
        {Number(item.cost * item.quantity).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  </div>
</div>

                </div>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="mt-4">
            <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
            <h5>Tax: ${tax.toFixed(2)}</h5>
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <Link to="/home" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <Link to="/checkout" className="btn btn-primary">
              Complete Purchase
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

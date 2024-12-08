import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

// Base API URL
const apiUrl = import.meta.env.VITE_API_HOST;

export default function Details() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // Store the comic details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store any errors that occur
  const [cookies, setCookie] = useCookies(['cart']); // Manage cart using cookies
  const [cartCount, setCartCount] = useState(0); // Track the number of items in the cart

  // Fetch product details when the component loads or the `id` changes
  useEffect(() => {
    async function fetchProduct() {
      try {
        const url = `${apiUrl}/products/${id}`; // API endpoint for the product
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setProduct(data); // Save the product details
        } else {
          setError('Product not found.'); // Handle product not found
        }
      } catch (error) {
        setError('Error fetching product data.'); // Handle fetch errors
      } finally {
        setLoading(false); // Stop loading state
      }
    }
    fetchProduct();
  }, [id]);

  // Initialize cart count when the component loads
  useEffect(() => {
    const currentCart = cookies.cart ? String(cookies.cart).split(',') : [];
    setCartCount(currentCart.length);
  }, [cookies.cart]);

  // Function to add the product to the cart
  const addToCart = (productId) => {
    // Convert the `cookies.cart` string to an array, or initialize as empty
    const currentCart = cookies.cart ? String(cookies.cart).split(',') : [];

    // Add the new product ID to the cart
    currentCart.push(productId.toString());

    // Update the cart cookie with the updated array
    setCookie('cart', currentCart.join(','), { path: '/', maxAge: 3600000 }); // 1-hour expiry

    // Update the cart count
    setCartCount(currentCart.length);

    console.log('Updated Cart Cookie:', currentCart); // Debugging log: Remove later
  };

  // Show loading message while data is being fetched
  if (loading) {
    return <p className='text-center'>Loading...</p>;
  }

  // Show error message if something went wrong
  if (error) {
    return <p className='text-center text-danger'>{error}</p>;
  }

  // Render the product details if successfully loaded
  return (
    <div className='container my-5'>
      {/* Background container for styling */}
      <div className='bg-light p-4 rounded shadow-lg'>
        {/* Back button to navigate to the home page */}
        <Link to='/home' className='btn btn-outline-secondary mb-3'>
          Go Back
        </Link>

        {/* Comic title */}
        <h1 className='text-center display-4 text-primary mb-4'>
          Comic #{product.product_id}
        </h1>

        {/* Display Comic details */}
        {product && (
          <div className='row'>
            {/* Left column: Comic information */}
            <div className='col-md-6'>
              <h2 className='text-dark'>
                <p>
                  <strong>Name:</strong> {product.name}
                </p>
              </h2>
              <p>
                <strong>Description:</strong>{' '}
                <span className='text-secondary'>{product.description}</span>
              </p>
              <p>
                <strong>Price:</strong>{' '}
                <span className='text-success'>
                  {/* SOURCE: commas in number strings */}
                  {/*https://www.w3schools.com/jsref/jsref_tolocalestring.asp*/}
                  ${Number(product.cost).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
              {/* Add to Cart button */}
              <button
                className='btn btn-primary rounded-pill mt-2 mb-2 border align-self-stretch position-relative'
                onClick={() => addToCart(product.product_id)}
              >
                Add to Cart
                {/* Badge for cart count */}
                {/* SOURCE: https://www.w3schools.com/bootstrap5/bootstrap_badges.php} */}
                <span
                  className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
                  style={{ zIndex: 1050 }}
                >
                  {cartCount}
                </span>
              </button>
            </div>

            {/* Right column: Product image */}
            <div className='col-md-6 d-flex justify-content-center align-items-center'>
              <img
                src={`${apiUrl}/images/${product.image_filename}`} // Generate image URL
                alt={`${product.name} cover`}
                className='img-fluid rounded shadow'
                style={{ maxHeight: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

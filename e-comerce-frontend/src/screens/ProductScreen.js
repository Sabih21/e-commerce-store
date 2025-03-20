import './ProductScreen.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaStar } from 'react-icons/fa'

// Actions
import { getProductDetails } from '../redux/actions/productActions'
import { addToCart } from '../redux/actions/cartActions'

// reCAPTCHA
import ReCAPTCHA from 'react-google-recaptcha'

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1)
  const [review, setReview] = useState('')
  const [IP, setIP] = useState('')
  const [rating, setRating] = useState(0)
  const [captchaValue, setCaptchaValue] = useState(null) // Captcha value
  const [success, setSuccess] = useState(null) // Captcha value
  const [reviews, setReviews] = useState([]);  // New state for reviews

  // Fetching user state from Redux
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  // Fetching product details from Redux
  const productDetails = useSelector(state => state.getProductDetails)
  const { loading, error, product } = productDetails

  // Fetch product details and reviews on component mount
  useEffect(() => {
    if (product && match.params.id !== product._id) {
      dispatch(getProductDetails(match.params.id))
    }

    // Fetch reviews for the product
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/fetch_reviews?productId=${match.params.id}`);
        const data = await response.json();
        
        // Log the response to check its structure
        console.log("Fetched reviews data:", data);
    
        // Check if the response is an array before applying filter
        if (Array.isArray(data)) {
          // Filter reviews to only include those with flag value 0
          const filteredReviews = data.filter(review => review.flag === 0);
          setReviews(filteredReviews);
        } else {
          console.error("The data received is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    

    fetchReviews();
  }, [dispatch, match, product]);

  // Handle Add to Cart functionality
  const addToCartHandler = () => {
    if (user.userInfo.isLogin) {
      dispatch(addToCart(product._id, qty))
      history.push(`/cart`)
    } else {
      alert('You need to first login.')
    }
  }

  // Submit review handler
  const submitReviewHandler = async () => {
    if (review.trim() && captchaValue) {
      try {
        const userId = localStorage.getItem('userId'); // Get user ID from local storage
        console.log(userId);
        const response = await fetch('http://localhost:3000/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.userInfo.token}`, // Send the user's token for authentication
          },
          body: JSON.stringify({
            productId: product._id,
            rating,
            user: userId, // Pass the userId in the request body
            comment: review,
            ipAddress: IP,
            recaptchaToken: captchaValue, // Include the reCAPTCHA token in the request
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // alert('Review Submitted!')
          setReview('')
          setRating(5)
          setCaptchaValue(null) // Reset captcha after successful submission
          setSuccess("Done")
          
        } else {
          // alert(data.message || 'Something went wrong')
        }
      } catch (error) {
        // alert('Failed to submit review. Please try again later.')
      }
    } else {
      // alert('Please complete the reCAPTCHA and enter a review before submitting.')
    }
  }

  // Handle CAPTCHA response
  const handleCaptchaChange = (value) => {
    console.log(rating);
    if(value == 0){
      setCaptchaValue(null)
      return;
    }
    setCaptchaValue(value)
  }

  return (
    <div className="productscreen">
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <>
          <div className="productscreen__left">
            <div className="left__image">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="left__info">
              <p className="left__name">{product.name}</p>
              <p>Price: ${product.price}</p>
              <p>Description: {product.description}</p>
            </div>
          </div>
          <div className="productscreen__right">
            <div className="right__info">
              <p>
                Price: <span>${product.price}</span>
              </p>
              <p>
                Status: <span>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </p>
              <p>
                Qty
                <select value={qty} onChange={e => setQty(e.target.value)}>
                  {[...Array(product.countInStock).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </p>
              <p>
                <button type="button" onClick={addToCartHandler}>Add To Cart</button>
              </p>
            </div>
          </div>

          {/* Review Submission Section */}
          <div className="productscreen__right">
            <div className="right__info" style={{ width: "auto" }}>
              {success ? (
                // ✅ Show success message if the review was submitted
                <div style={{ color: "green", fontWeight: "bold", marginTop: "10px", width: "300px", textAlign: "center", padding: "20px" }}>
                  Review submitted successfully!
                </div>
              ) : (
                // ✅ Show review form only if success is not set
                <>
                  <p>
                    <h3>Add a Review</h3>
                  </p>

                  <div style={{ padding: "20px" }}>
                    Stars:
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={24}
                          color={star <= rating ? "#ffc107" : "#e4e5e9"}
                          onClick={() => setRating(star)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  </div>

                  <p style={{ gridTemplateColumns: "repeat(1, 1fr)", display: "grid" }}>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Write your review here..."
                    ></textarea>
                    <input
                      type="text"
                      value={IP}
                      onChange={(e) => setIP(e.target.value)}
                      style={{ display: "none" }}
                    />
                  </p>

                  <p>
                    <ReCAPTCHA
                      sitekey="6LdfuvkqAAAAAEklTUr1ah0TIyhEtV7xi5sDa53z"
                      onChange={handleCaptchaChange}
                      data-size="compact"
                    />
                  </p>

                  <p>
                    <button
                      type="button"
                      onClick={submitReviewHandler}
                      disabled={!captchaValue}
                    >
                      Submit Review
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="productscreen__reviews">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews available.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review">
                    <div className="review-header">
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            size={20}
                            color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                          />
                        ))}
                      </div>
                      <div className="review-author">
                        <p>{review.user.fullName}</p>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}        
          </div>

        </>
      )}
    </div>
  )
}                                           

export default ProductScreen

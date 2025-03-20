import { FaStar } from "react-icons/fa";

const ReviewsSection = ({ reviews }) => {
  return (
    <div className="productscreen__reviews">
          <h3>Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews available.</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review">
                  <div className="review-header">
                  <div className="review-header-second">
                    <div className="text-lg font-medium text-gray-800">{review.user.fullName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
             
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                    </div>
                    <hr/>
                    <br/>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
  );
};

export default ReviewsSection;

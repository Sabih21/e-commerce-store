import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';

const FlaggedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlaggedReviews = async () => {
      try {
        
        const response = await axios.get('http://localhost:3000/api/flagged');
        console.log("API Response:", response.data); // Debugging line

        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching flagged reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedReviews();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <div className="w-64 bg-white shadow-md fixed h-full">
      <Sidebar />
    </div>
  
    {/* Main Content */}
    <div style={contentStyle}>

      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🚩 Flagged Reviews
          </h1>
  
          {loading ? (
            <p className="text-center text-gray-500">Loading flagged reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-600">No flagged reviews found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border">#</th>
                    <th className="py-2 px-4 border">Product Name</th>
                    <th className="py-2 px-4 border">User</th>
                    <th className="py-2 px-4 border">Rating</th>
                    <th className="py-2 px-4 border">Comment</th>
                    <th className="py-2 px-4 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={review._id} className="text-gray-700 text-center border-t">
                      <td className="py-2 px-4 border">{index + 1}</td>
                      <td className="py-2 px-4 border font-semibold">{review.product.price || 'N/A'}</td>
                      <td className="py-2 px-4 border">
                        {review.user?.name || 'Unknown'} <br />
                        <span className="text-xs text-gray-500">{review.user?._id}</span>
                      </td>
                      <td className="py-2 px-4 border">{review.rating} ⭐</td>
                      <td className="py-2 px-4 border">{review.comment}</td>
                      <td className="py-2 px-4 border">
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                          Flagged 🚩
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>

  
  );
};
const contentStyle = {
    marginLeft: "270px",
    padding: "20px",
  };
export default FlaggedReviews;

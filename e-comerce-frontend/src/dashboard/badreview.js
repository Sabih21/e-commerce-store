import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

const BadReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch flagged reviews
  useEffect(() => {
    const fetchBadReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/flagged");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching flagged reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadReviews();
  }, []);

  const handleApproveClick = async (itemId) => {
    const isConfirmed = window.confirm("Are you sure you want to approve this review?");
    if (!isConfirmed) return;

    try {
      const response = await axios.post("http://localhost:3000/api/flagged/approved", { id: itemId });
      if (response.data.success) {
        // Update the review flag to 0 in local state immediately after approval
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === itemId
              ? { ...review, flag: 0 } // Change flag to 0
              : review
          )
        );

        alert("Review marked as approved!");
      }
    } catch (error) {
      console.error("Error marking review as approved:", error);
      alert("Failed to mark review as approved.");
    }
  };

  // Initialize DataTable after data is fetched
  useEffect(() => {
    if (reviews.length > 0) {
      setTimeout(() => {
        $("#tab").DataTable();
      }, 100);
    }
  }, [reviews]);

  return (
    <div style={contentStyle}>
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col px-4" style={{ width: "100%" }}>
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              ⚠️ Flagged Reviews
            </h1>

            {loading ? (
              <p className="text-center text-gray-500">Loading flagged reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-600">No flagged reviews found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table
                  id="tab"
                  className="display min-w-full bg-white border border-gray-300 rounded-lg shadow-md"
                >
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      <th className="py-2 px-4 border">Product Name</th>
                      <th className="py-2 px-4 border">User</th>
                      <th className="py-2 px-4 border">Rating</th>
                      <th className="py-2 px-4 border">Comment</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id} className="text-gray-700 text-center border-t">
                        <td className="py-2 px-4 border font-semibold">{review.product?.name || "N/A"}</td>
                        <td className="py-2 px-4 border">
                          {review.user?.fullName || "Unknown"} <br />
                          <span className="text-xs text-gray-500">{review.user?.email}</span>
                        </td>
                        <td className="py-2 px-4 border">{review.rating} ⭐</td>
                        <td className="py-2 px-4 border">{review.comment}</td>
                        <td className="py-2 px-4 border">
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                            Flagged ⚠️
                          </span>
                          <hr className="m-0" style={{ marginBottom: "10px", marginTop: "10px" }} />
                          <span className="text-xs text-gray-500">
                            {review.flagReason
                              ?.split(", ") // Convert comma-separated string into an array
                              .map((reason, i) => (
                                <div style={{ color: "#4b4b4b" }} key={i}>
                                  {i + 1}. {reason}
                                </div>
                              ))}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">
                          {review.flag !== 0 ? (
                            <button className="approve-button" onClick={() => handleApproveClick(review._id)}>
                              Mark As Approved
                            </button>
                          ) : (
                            <span className="text-green-500">Approved ✅</span>
                          )}
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
  width: "100%",
  height: "100%",
  display: "flex",
};

export default BadReviews;

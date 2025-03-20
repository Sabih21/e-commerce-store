import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

const ApprovedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/approved");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching approved reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      setTimeout(() => {
        $("#tab").DataTable();
      }, 100);
    }
  }, [reviews]); // Run DataTable after data is fetched

  return (
    <div style={contentStyle}>
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col px-4" style={{width:"100%"}}>
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              ✅ Approved Reviews
            </h1>

            {loading ? (
              <p className="text-center text-gray-500">
                Loading approved reviews...
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-600">
                No approved reviews found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table
                  id="tab"
                  className="display min-w-full bg-white border border-gray-300 rounded-lg shadow-md"
                >
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
                        <td className="py-2 px-4 border font-semibold">
                          {review.product?.name || "N/A"}
                        </td>
                        <td className="py-2 px-4 border">
                          {review.user?.email || "Unknown"} <br />
                          <span className="text-xs text-gray-500">
                            {review.user?.email}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">{review.rating} ⭐</td>
                        <td className="py-2 px-4 border">{review.comment}</td>
                        <td className="py-2 px-4 border">
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                            Approved ✅
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
  width: "100%",
  height: "100%",
  display: "flex",
};

export default ApprovedReviews;

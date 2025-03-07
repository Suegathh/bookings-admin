import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookings, reset } from "../features/booking/bookingSlice";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Redux state selectors
  const { user } = useSelector((state) => state.auth);
  const { bookings, isLoading, isError, message, isSuccess } = useSelector((state) => state.booking);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ No valid authentication credentials");
      navigate("/");
      return;
    }

    setAuthCheckComplete(true);
  }, [navigate]);

  useEffect(() => {
    if (authCheckComplete) {
      dispatch(getBookings());
    }
  }, [authCheckComplete, dispatch]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Booking List</h1>
      </header>

      <section className="bookings-section">
        {isLoading && <p className="loading-text">Loading bookings...</p>}
        {isError && <p className="error-text">Error: {message || "Failed to load bookings"}</p>}

        {!isLoading && !isError && bookings.length > 0 ? (
          <div className="table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Confirmed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.name || booking.customerName || booking.userName || "N/A"}</td>
                    <td>{booking.email || "N/A"}</td>
                    <td>{booking.roomId?.name || booking.room?.name || "Unknown Room"}</td>
                    <td>{booking.confirmed ? "Yes" : "No"}</td>
                    <td>
                      <button 
                        className="view-btn" 
                        onClick={() => navigate(`/bookings/${booking._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-bookings-text">No bookings found.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

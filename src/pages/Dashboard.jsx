import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookings, reset } from "../features/booking/bookingSlice";
import BookingList from "../components/BookingList";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [localUserData, setLocalUserData] = useState(null);

  // Redux state selectors
  const { user } = useSelector((state) => state.auth);
  const { bookings, isLoading, isError, message: bookingMessage, isSuccess } = useSelector((state) => state.booking);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      console.warn("❌ No valid authentication credentials");
      navigate("/login");
      return;
    }

    setLocalUserData(storedUser);
    setAuthCheckComplete(true);
  }, [navigate]);

  useEffect(() => {
    if (authCheckComplete) {
      dispatch(getBookings());
    }
  }, [authCheckComplete, dispatch]);

  // ✅ Navigate to full booking list page
  const handleViewAllBookings = () => {
    navigate("/bookings");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {localUserData?.name || "User"}</h1>
      </header>

      <section className="bookings-section">
        <h2>Recent Bookings</h2>

        {isLoading && <p>Loading bookings...</p>}
        {isError && <p className="error-text">Error: {bookingMessage || "Failed to load bookings"}</p>}
        {!isLoading && !isError && (!bookings || bookings.length === 0) && <p>No bookings found.</p>}

        {bookings && bookings.length > 0 && (
          <>
            <BookingList data={bookings.slice(0, 5)} /> {/* Show only 5 recent bookings */}

            {/* ✅ Button to View Full Booking List */}
            <button className="view-all-btn" onClick={handleViewAllBookings}>
              View All Bookings
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

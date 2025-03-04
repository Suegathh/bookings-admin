import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookings, reset } from "../features/booking/bookingSlice";
import BookingList from "../components/BookingList";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { bookings, isSuccess, isLoading, isError, message } = useSelector((state) => state.booking);

  // Reset state when necessary
  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    console.log("Bookings in Dashboard:", bookings);
  }, [bookings]);
  
  // Fetch bookings only when user is available
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getBookings());
    }
  }, [user, dispatch, navigate]);

  return (
    <div>
      <h1 className="heading center">Dashboard</h1>

      {isLoading && <p>Loading bookings...</p>}
      {isError && <p className="error">Error: {message}</p>}

      {bookings?.length > 0 ? (
  <ul>
    {bookings.map((booking, index) => (
      <li key={index}>{booking.hotelName}</li> // Ensure property exists
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}

    </div>
  );
};

export default Dashboard;

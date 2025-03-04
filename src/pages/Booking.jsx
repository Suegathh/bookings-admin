import { useEffect, useState } from "react";
import "./Booking.scss";
import { useParams, useNavigate } from "react-router-dom";
import { confirmBooking, deleteBooking, reset } from "../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";

const Booking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSuccess, isLoading, isError, message } = useSelector((state) => state.booking);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate("/dashboard");
    }
  }, [isSuccess]); // Keep only necessary dependencies

  useEffect(() => {
    dispatch(reset());

    const controller = new AbortController();
    const getBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`, {
          method: "GET",
          credentials: "include", // Send cookies
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
    
        const data = await res.json();
        setBooking(data);
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError(error.message);
      }
    };
    

    getBooking();
    return () => controller.abort(); // Cleanup fetch on unmount
  }, [id]); // Depend on id to refetch when it changes

  const handleDelete = () => dispatch(deleteBooking(id));
  const handleConfirm = () => dispatch(confirmBooking(id));

  return (
    <div id="booking">
      <h1 className="heading center">Booking</h1>

      {error && <p className="error">{error}</p>} {/* Display error if fetching fails */}

      {booking ? (
        <div className="content-wrapper">
          <div className="text-wrapper">
            <h1 className="heading">{booking.name}</h1>
            <p className="email">{booking.roomId?.name || "No Room Assigned"}</p>
            <p className="email">{booking.email}</p>
            <p className="email">Check-in: {booking.checkInDate}</p>
            <p className="email">Check-out: {booking.checkOutDate}</p>
          </div>

          <div className="cta-wrapper">
            <button onClick={handleConfirm} disabled={isLoading}>Confirm</button>
            <button className="danger" onClick={handleDelete} disabled={isLoading}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default Booking;

import { useEffect, useState } from "react";
import "./Booking.scss";
import { useParams, useNavigate } from "react-router-dom";
import { confirmBooking, deleteBooking, reset } from "../features/booking/bookingSlice";
import { useDispatch, useSelector } from "react-redux";

const API_URL = "https://booking-backend-bice.vercel.app";

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
  }, [isSuccess, dispatch, navigate]); // Fixed dependencies

  useEffect(() => {
    dispatch(reset());

    const controller = new AbortController();
    const signal = controller.signal;

    const getBooking = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }

        const res = await fetch(`${API_URL}/api/bookings/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          signal,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP Error! Status: ${res.status}`);
        }

        const data = await res.json();
        setBooking(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error.message);
          setError(error.message);
        }
      }
    };

    getBooking();
    return () => controller.abort();
  }, [id, dispatch]);

  const handleDelete = () => {
    dispatch(deleteBooking(id));
  };

  const handleConfirm = () => {
    dispatch(confirmBooking(id));
  };

  return (
    <div id="booking">
      <h1 className="heading center">Booking</h1>

      {error && <p className="error">{error}</p>}

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

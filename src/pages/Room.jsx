import "./Room.scss";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, reset } from "../features/room/roomSlice";
import Carousel from "../components/Carousel";

const API_URL = "https://bookings-backend-g8dm.onrender.com";

const Room = () => {
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Handle Navigation After Room Deletion
  useEffect(() => {
    if (isSuccess) {
      navigate("/rooms");
      dispatch(reset());
    }
  }, [isSuccess, dispatch, navigate]);

  // ✅ Fetch Room Details
  useEffect(() => {
    const getRoom = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        } else {
          console.error("Failed to fetch room data");
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      }
      setLoading(false);
    };

    getRoom();
  }, [id]);

  const handleDelete = () => {
    dispatch(deleteRoom(id));
  };

  return (
    <div id="room">
      <div className="container">
        {loading ? (
          <p>Loading room details...</p>
        ) : room ? (
          <div>
            <div className="img-wrapper">
              <Carousel data={room.img} />
            </div>
            <div className="text-wrapper">
              <h1 className="heading center">{room.name}</h1>
              <p>{room.desc}</p>
              <h2>${room.price.toFixed(2)}</h2>
            </div>

            {/* ✅ Everyone can now see Edit/Delete buttons */}
            <div className="cta-wrapper">
              <Link to={`/rooms/edit/${room._id}`}>Edit Room</Link>
              <button onClick={handleDelete}>Delete Room</button>
            </div>
          </div>
        ) : (
          <p>Room not found.</p>
        )}
      </div>
    </div>
  );
};

export default Room;

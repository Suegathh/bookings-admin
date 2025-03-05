import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateRoom, reset } from "../features/room/roomSlice";
import { useSelector, useDispatch } from "react-redux";

const API_URL = "https://booking-backend-bice.vercel.app"; // ✅ Ensure API URL

const EditRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { isSuccess, isLoading, isError, message } = useSelector((state) => state.room);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    roomNumbers: "",
  });

  const { name, price, desc, roomNumbers } = formData;

  // ✅ Fetch Room Data on Component Mount
  useEffect(() => {
    const getRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch room data: ${res.status}`);

        const data = await res.json();

        // ✅ Convert roomNumbers array to a comma-separated string safely
        const roomString = (data.roomNumbers || []).map((item) => item.number).join(", ");

        setFormData({
          name: data.name || "",
          price: data.price || "",
          desc: data.desc || "",
          roomNumbers: roomString,
        });
      } catch (error) {
        console.error("Fetch Error:", error.message);
        setError(error.message);
      }
      setLoading(false);
    };

    getRoom();
  }, [id]);

  // ✅ Redirect on Successful Update
  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate("/rooms");
    }
  }, [isSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !roomNumbers.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // ✅ Convert roomNumbers string to an array of objects
    const roomArray = roomNumbers
      .split(",")
      .map((num) => {
        const parsedNum = parseInt(num.trim(), 10);
        return !isNaN(parsedNum) ? { number: parsedNum, unavailableDates: [] } : null;
      })
      .filter(Boolean); // ✅ Remove null values

    const dataToSubmit = {
      name,
      price: parseFloat(price),
      desc,
      roomNumbers: roomArray,
      roomId: id, // ✅ Ensure `id` is sent
    };

    dispatch(updateRoom(dataToSubmit));
  };

  return (
    <div className="container">
      <h1 className="heading center">Edit Room</h1>

      <div className="form-wrapper">
        {loading ? (
          <p>Loading room details...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Enter room name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                value={price}
                placeholder="Enter room price"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="desc">Description</label>
              <textarea name="desc" onChange={handleChange} value={desc}></textarea>
            </div>

            <div className="input-group">
              <label htmlFor="roomNumbers">Room Numbers</label>
              <textarea
                name="roomNumbers"
                onChange={handleChange}
                value={roomNumbers}
                placeholder="Enter room numbers separated by commas (e.g. 202, 203, 204)"
                required
              ></textarea>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditRoom;

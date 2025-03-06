import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateRoom, reset } from "../features/room/roomSlice";
import "./EditRoom.scss";

const API_URL = "https://bookings-backend-g8dm.onrender.com";

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
    images: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const { name, price, desc, roomNumbers, images } = formData;

  useEffect(() => {
    const getRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to fetch room data: ${res.status}`);

        const data = await res.json();
        const roomString = (data.roomNumbers || []).map((item) => item.number).join(", ");

        setFormData({
          name: data.name || "",
          price: data.price || "",
          desc: data.desc || "",
          roomNumbers: roomString,
          images: data.img || [],
        });
      } catch (error) {
        console.error("Fetch Error:", error.message);
        setError(error.message);
      }
      setLoading(false);
    };

    getRoom();
  }, [id]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !roomNumbers.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const roomArray = roomNumbers
      .split(",")
      .map((num) => {
        const parsedNum = parseInt(num.trim(), 10);
        return !isNaN(parsedNum) ? { number: parsedNum, unavailableDates: [] } : null;
      })
      .filter(Boolean);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseFloat(price));
    formData.append("desc", desc);
    formData.append("roomNumbers", JSON.stringify(roomArray));

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateRoom({ roomId: id, formData }));
  };

  return (
    <div className="container">
      <h2 className="text-center text-xl font-bold mb-4">Edit Room</h2>

      {loading ? (
        <p className="text-center">Loading room details...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Room Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} required />

          <label htmlFor="price">Price</label>
          <input type="number" name="price" value={price} onChange={handleChange} required />

          <label htmlFor="desc">Description</label>
          <textarea name="desc" onChange={handleChange} value={desc} />

          <label htmlFor="roomNumbers">Room Numbers</label>
          <textarea
            name="roomNumbers"
            onChange={handleChange}
            value={roomNumbers}
            placeholder="Enter room numbers (e.g., 101, 102, 103)"
            required
          ></textarea>

          {/* Existing Images */}
          <div className="image-preview-container">
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Room ${index}`} />
            ))}
          </div>

          {/* Upload New Images */}
          <label>Upload New Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />

          <div className="button-group">
            <button className="action-button" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Room"}
            </button>
            <button className="action-button delete" type="button">
              Delete
            </button>
            <button className="action-button cancel" type="button" onClick={() => navigate("/rooms")}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditRoom;

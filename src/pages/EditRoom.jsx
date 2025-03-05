import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateRoom, reset } from "../features/room/roomSlice";
import './EditRoom.scss';

const API_URL = "https://bookings-backend-g8dm.onrender.com"

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

  // Fetch Room Data
  useEffect(() => {
    const getRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, { 
          credentials: "include",
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error(`Failed to fetch room data: ${res.status}`);

        const data = await res.json();

        // Convert roomNumbers array to a comma-separated string
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

  // Redirect on Successful Update
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

  // Add handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !roomNumbers.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Convert roomNumbers string to an array of objects
    const roomArray = roomNumbers
      .split(",")
      .map((num) => {
        const parsedNum = parseInt(num.trim(), 10);
        return !isNaN(parsedNum) ? { number: parsedNum, unavailableDates: [] } : null;
      })
      .filter(Boolean);

    const dataToSubmit = {
      name,
      price: parseFloat(price),
      desc,
      roomNumbers: roomArray,
      roomId: id,
    };

    dispatch(updateRoom(dataToSubmit));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Room</h1>

      <div className="max-w-md mx-auto">
        {loading ? (
          <div className="text-center">Loading room details...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="name"
                value={name}
                placeholder="Enter room name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                name="price"
                value={price}
                placeholder="Enter room price"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="desc"
                onChange={handleChange}
                value={desc}
                placeholder="Enter room description"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomNumbers">
                Room Numbers
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="roomNumbers"
                onChange={handleChange}
                value={roomNumbers}
                placeholder="Enter room numbers separated by commas (e.g. 202, 203, 204)"
                required
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Room"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditRoom;

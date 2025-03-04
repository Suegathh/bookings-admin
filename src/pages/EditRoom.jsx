import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateRoom, reset } from "../features/room/roomSlice";
import { useSelector, useDispatch } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const EditRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    roomNumbers: "",
  });

  const { name, price, desc, roomNumbers } = formData;

  // ✅ Fetch Room Data
  useEffect(() => {
    const getRoom = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, { credentials: "include" });
        if (!res.ok) {
          throw new Error("Failed to fetch room data");
        }
        const data = await res.json();

        // ✅ Convert roomNumbers array to comma-separated string
        const roomString = data.roomNumbers.map((item) => item.number).join(",");

        setFormData({
          name: data.name,
          price: data.price,
          desc: data.desc || "",
          roomNumbers: roomString,
        });
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    getRoom();
  }, [id]); // ✅ Dependency added

  // ✅ Handle Navigation After Update
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
    if (!name || !price || !roomNumbers) {
      return;
    }

    const roomArray = roomNumbers
      .split(",")
      .map((item) => {
        const num = parseInt(item.trim(), 10);
        return isNaN(num) ? null : { number: num, unavailableDates: [] };
      })
      .filter((item) => item !== null); // ✅ Remove invalid numbers

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
    <div className="container">
      <h1 className="heading center">Edit Room</h1>

      <div className="form-wrapper">
        {loading ? (
          <p>Loading room details...</p>
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
                placeholder="Enter room numbers separated by commas e.g. 202, 203, 204"
                required
              ></textarea>
            </div>

            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditRoom;

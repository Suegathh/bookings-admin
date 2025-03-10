import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../Utilis";
import { createRoom, reset } from "../features/room/roomSlice"

const CreateRoom = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const { user } = useSelector((state) => state.auth);
    const { isSuccess } = useSelector((state) => state.room);
  
    const [files, setFiles] = useState("");
    const [formData, setFormData] = useState({
      name: "",
      price: '',
      desc: "",
      roomNumbers: "",
    });
  
    const { name, price, desc, roomNumbers } = formData;
  
    useEffect(() => {
      if (!user) {
        // navigate to login
        navigate("/login");
      }
    }, [user]);
  
    useEffect(() => {
      if (isSuccess) {
        dispatch(reset());
        navigate("/rooms");
      }
    }, [isSuccess]);
  
    const handleChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    };
  
    // handle File change
    const handleFileChange = (e) => {
      setFiles(e.target.files);
    };
    console.log("Current User:", user);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!user || !user.token) {
          console.error("User not authenticated. Redirecting to login...");
          navigate("/login");  // Redirect to login if no user is found
          return;
        }
      
        if (!name || !price || !roomNumbers) {
          console.error("Missing required fields");
          return;
        }
      
        const roomArray = roomNumbers.split(",").map((item) => ({
          number: parseInt(item.trim()),
          unavailableDates: [],
        }));
      
        try {
          const list = await Promise.all(
            Object.values(files).map(async (file) => {
              const url = await uploadImage(file);
              return url;
            })
          );
      
          const dataToSubmit = {
            name,
            price: Number(price),
            desc,
            roomNumbers: roomArray,
            img: list,
            token: user.token, // ✅ Ensure token is included
          };
      
          const response = await dispatch(createRoom(dataToSubmit)).unwrap();
          console.log("Room created successfully:", response);
        } catch (error) {
          console.error("Room Creation Error:", error);
        }
      };
      
  
    return (
      <div className="container">
  
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Enter room name"
                onChange={handleChange}
              />
            </div>
  
            <div className="input-group">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                name="price"
                value={price}
                placeholder="Enter room name"
                onChange={handleChange}
              />
            </div>
  
            <div className="input-group">
              <label htmlFor="desc">Description</label>
              <textarea
                name="desc"
                onChange={handleChange}
                value={desc}
              ></textarea>
            </div>
  
            <div className="input-group">
              <label htmlFor="desc">Room Numbers</label>
              <textarea
                name="roomNumbers"
                onChange={handleChange}
                value={roomNumbers}
                placeholder="enter room numbers seperated by commas eg: 202, 203, 204, 400"
              ></textarea>
            </div>
  
            <div className="input-group">
              <label htmlFor="name">Images</label>
              <input
                type="file"
                name="file"
                multiple
                onChange={handleFileChange}
              />
            </div>
  
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default CreateRoom;
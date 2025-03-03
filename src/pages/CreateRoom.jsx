import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../Utilis";
import { createRoom, reset } from "../features/room/roomSlice"

const CreateRoom = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const {isSuccess} = useSelector((state) => state.room)
    
    // Form state
    const [formData, setFormData] = useState({
        name: "test",
        price: "200",
        desc: "fxfgctftg",
        roomNumbers: "401, 205, 39,123",
    });

    const [files, setFiles] = useState(null); // File state

    const { name, price, desc, roomNumbers } = formData;

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
      if(isSuccess){
        dispatch(reset())
        navigate("/rooms")
      }
    })

    // Handle text input changes
    const handleChange = (e) => {
        setFormData( prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setFiles(e.target.files); 
    };

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!name || !price || !roomNumbers) {
        return;
      }
  
      const roomArray = roomNumbers.split(",").map((item) => {
        return {
          number: parseInt(item),
          unavailableDates: [],
        };
      });
  
      let list = [];
      list = await Promise.all(
        Object.values(files).map(async (file) => {
          const url = await uploadImage(file);
          return url;
        })
      );
     
      const dataToSubmit = {
        name,
        price,
        desc,
        roomNumbers: roomArray,
        img: list,
      };
      dispatch(createRoom(dataToSubmit))
  
    };

  
    return (
        <div className="container">
            <h1 className="heading center">Create Room</h1>
            <div className="form-wrapper">

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Enter room name" 
                            value={name} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="price">Price</label>
                        <input 
                            type="text" 
                            name="price" 
                            placeholder="Enter room price" 
                            value={price} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="desc">Description</label>
                        <textarea 
                            name="desc" 
                            placeholder="Enter room description"
                            onChange={handleChange} 
                            value={desc} 
                        ></textarea>
                    </div>

                    <div className="input-group">
                        <label htmlFor="roomNumbers">Room Numbers</label>
                        <textarea 
                            name="roomNumbers" 
                            placeholder="Enter room numbers, separated by commas"
                            onChange={handleChange} 
                            value={roomNumbers} 
                          
                        ></textarea>
                    </div>

                    <div className="input-group">
                        <label htmlFor="images">Images</label>
                        <input 
                            type="file" 
                            name="file" 
                            multiple 
                            onChange={handleFileChange} 
                        />
                    </div>

                    <button type="submit">Create Room</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoom;

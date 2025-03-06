import { getRooms, reset } from "../features/room/roomSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoomList from "../components/RoomList";
import "./Rooms.scss"; // Import the new stylesheet

const Rooms = () => {
  const dispatch = useDispatch();
  const { rooms, isLoading, isSuccess } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [isSuccess, dispatch]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <h1 className="heading">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="container">
        {rooms.length > 0 ? <RoomList data={rooms} /> : <p>No rooms available</p>}
      </div>
    </div>
  );
};

export default Rooms;

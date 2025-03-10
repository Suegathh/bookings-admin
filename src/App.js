import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";
import EditRoom from "./pages/EditRoom";
import Booking from "./pages/Booking";
import RoomList from "./components/RoomList";
import BookingList from "./components/BookingList";// ✅ Import missing component

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roomList" element={<RoomList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/create" element={<CreateRoom />} />
          <Route path="/rooms/all/:id" element={<Room />} />
          <Route path="/rooms/edit/:id" element={<EditRoom />} />
          {/* <Route path="/bookings" element={<BookingList />} /> */}
          <Route path="/bookings/:id" element={<Booking />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

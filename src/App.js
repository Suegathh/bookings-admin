import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "./App.scss"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import CreateRoom from "./pages/CreateRoom"
import Rooms from "./pages/Rooms"
import Room from "./pages/Room"
import EditRoom from "./pages/EditRoom"
import Booking from "./pages/Booking"

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/create" element={<CreateRoom />} />
          <Route path="/rooms/all/:id" element={<Room />} />
          <Route path="/rooms/edit/:id" element={<EditRoom />} />
          <Route path="s/:id" element={<Booking />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
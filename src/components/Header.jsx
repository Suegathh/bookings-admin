import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, reset } from "../features/auth/authSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    setMenuOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <header className="main-header">
      {/* Logo on the Left */}
      <Link to="/" className="logo">Sand Dunes Villa</Link>

      {/* Dropdown Menu Button on the Right */}
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖ Close" : "☰ Menu"}
      </button>

      {/* Dropdown Navigation Menu (Visible on Mobile without Scroll) */}
      <nav className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/rooms" onClick={() => setMenuOpen(false)}>Rooms</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/rooms/create" onClick={() => setMenuOpen(false)}>Create</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;

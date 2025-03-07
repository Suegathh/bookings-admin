import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { Menu, Home, LogOut, PlusCircle, LayoutDashboard, Bed } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser, reset } from "../features/auth/authSlice";

const menuItems = [
  { title: "Home", url: "/", icon: <Home size={20} /> },
  { title: "Rooms", url: "/rooms", icon: <Bed size={20} /> },
  { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Create", url: "/create", icon: <PlusCircle size={20} /> },
];

const Header = () => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    setMenuOpen(false);
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">Sand Dunes Villa</h2>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.url} className="sidebar-link">
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Header for Mobile */}
      <header className="mobile-header">
        <div className="header-content">
          <h1 className="logo">Sand Dunes Villa</h1>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Dropdown Menu (Mobile Only) */}
        <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {menuItems.map((item) => (
            <Link key={item.title} to={item.url} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </header>
    </>
  );
};

export default Header;

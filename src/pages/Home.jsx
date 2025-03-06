import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, reset } from "../features/auth/authSlice";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const { email, password } = formData;

  useEffect(() => {
    console.group("Login Flow Debug");
    console.log("Current User:", user);
    console.log("Login State:", { isLoading, isSuccess, isError, message });
    console.log("Local Storage:", {
      storedUser: localStorage.getItem("user"),
      storedToken: localStorage.getItem("token"),
    });
    console.groupEnd();

    if (isSuccess && user) {
      try {
        if (user.token) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", user.token);

          navigate("/dashboard");

          dispatch(reset());
        }
      } catch (storageError) {
        console.error("Storage error:", storageError);
        setErrorMsg("Unable to complete login. Please try again.");
      }
    }

    if (isError) {
      setErrorMsg(message || "Login failed. Please check your credentials.");
      dispatch(reset());
    }
  }, [isSuccess, isError, message, user, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      console.group("🔑 Login Result Verification");
      console.log("Full Login Result:", result);
      console.log("Token in Result:", {
        exists: !!result.token,
        length: result.token ? result.token.length : "No Token",
        prefix: result.token ? result.token.substring(0, 10) : "N/A",
      });
      console.groupEnd();

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result));
      } else {
        throw new Error("No token received");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Detailed Login Error:", error);
      setErrorMsg(error.toString());
    }
  };

  return (
    <div className="home-container">
      <div className="content-wrapper">
        {/* Left Side - Image */}
        <div className="hero-image-container">
          <img src="./images/hotel1.jpeg" alt="Hotel" className="hero-image" />
        </div>

        {/* Right Side - Login Form */}
        <div className="hero-content">
          <h1 className="animate-text">Welcome Back</h1>
          <p className="animate-subtext">Login to manage your bookings</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="error-banner">
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="cta-button">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;

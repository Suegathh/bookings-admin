import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, reset } from "../features/auth/authSlice";
import './Login.scss'

const Login = () => {
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
    // Comprehensive authentication flow logging
    console.group("Login Flow Debug");
    console.log("Current User:", user);
    console.log("Login State:", {
      isLoading,
      isSuccess,
      isError,
      message,
    });
    console.log("Local Storage:", {
      storedUser: localStorage.getItem("user"),
      storedToken: localStorage.getItem("token"),
    });
    console.groupEnd();

    // Successful login handling
    if (isSuccess && user) {
      // Ensure token and user are stored consistently
      try {
        if (user.token) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", user.token);
          
          // Navigate to dashboard after successful login
          navigate("/dashboard");
          
          // Reset auth state
          dispatch(reset());
        }
      } catch (storageError) {
        console.error("Storage error:", storageError);
        setErrorMsg("Unable to complete login. Please try again.");
      }
    }

    // Error handling
    if (isError) {
      setErrorMsg(
        message || "Login failed. Please check your credentials."
      );
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
      
      console.group('🔑 Login Result Verification');
      console.log('Full Login Result:', result);
      console.log('Token in Result:', {
        exists: !!result.token,
        length: result.token ? result.token.length : 'No Token',
        prefix: result.token ? result.token.substring(0, 10) : 'N/A'
      });
      console.groupEnd();
  
      // Explicit and comprehensive token storage
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
      } else {
        throw new Error('No token received');
      }
  
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Detailed Login Error:', error);
      setErrorMsg(error.toString());
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="error-banner">
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
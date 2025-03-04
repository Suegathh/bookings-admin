import { useState, useEffect } from "react";
import { loginUser, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Save user in local storage
      navigate("/dashboard");
      dispatch(reset());
    }

    if (isError) {
      setErrorMsg(message || "Invalid login credentials");
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

    if (!email || !password) {
      setErrorMsg("Both fields are required");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap(); // ✅ Unwrap for error handling
    } catch (error) {
      setErrorMsg(error.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1 className="heading center">Login</h1>

      <div className="form-wrapper">
        {errorMsg && <p className="error-message">{errorMsg}</p>} {/* ✅ Show error message */}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

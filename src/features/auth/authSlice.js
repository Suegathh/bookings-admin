import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Fetch user data from localStorage safely
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

// 🚀 Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include", 
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.message || "Registration failed");
      }

      return await res.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🚀 Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      console.log("Login Attempt:", userData);
      
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(userData),
      });

      console.log("Login Response Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Login Error:", errorText);
        return thunkAPI.rejectWithValue(errorText || "Login failed");
      }

      const data = await res.json();
      console.log("Login Response Data:", data);

      // Ensure token is stored properly
      const userWithToken = { ...data, token: data.token };
      localStorage.setItem("user", JSON.stringify(userWithToken));

      return userWithToken;
    } catch (error) {
      console.error("Login Error:", error);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🚀 Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const logoutUrl = `${API_URL}/api/users/logout`;
      console.log("Attempting logout:", logoutUrl);

      const response = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
      });

      console.log("Logout Response:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Logout Error:", errorText);
        return thunkAPI.rejectWithValue(errorText || "Logout failed");
      }

      localStorage.removeItem("user");
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout Error:", error);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const initialState = {
  user: user,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // 🚀 Register Cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // 🚀 Login Cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // 🚀 Logout Cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.message = "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

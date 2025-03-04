import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/users"; // Change this if deploying

// Fetch user data from localStorage
const user = JSON.parse(localStorage.getItem("user")) || null;

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkApi) => {
    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include", // 🔥 Fix: Ensures cookies are sent
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      return await res.json();
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, thunkApi) => {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Important for cookies
          body: JSON.stringify(userData),
        });
  
        if (!res.ok) {
          const error = await res.json();
          console.error("Login Error:", error);
          return thunkApi.rejectWithValue(error);
        }
  
        const data = await res.json();
        
        // Ensure token is included
        const userWithToken = {
          ...data,
          token: data.token // From the backend response
        };
  
        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(userWithToken));
  
        return userWithToken;
      } catch (error) {
        console.error("Login Catch Error:", error);
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );
// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkApi) => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "GET",
        credentials: "include", // 🔥 Fix: Ensures cookies are sent
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      localStorage.removeItem("user"); // Remove user from localStorage
      return await res.json();
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: user ? user : null,
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
        state.message = action.payload; // 🔥 Fix: Corrected typo
      })
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
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
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

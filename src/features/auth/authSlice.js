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
        // Comprehensive request logging
        console.group('Login Request Details');
        console.log('API URL:', `${API_URL}/api/users/login`);
        console.log('Request Payload:', {
          email: userData.email,
          passwordLength: userData.password.length
        });
        console.groupEnd();
  
        // Detailed fetch configuration
        const res = await fetch(`${API_URL}/api/users/login`, {
          method: "POST",
          credentials: 'include',
          headers: { 
            "Content-Type": "application/json",
            // Optional: Add additional headers for debugging
            "X-Request-Source": "React-Frontend"
          },
          body: JSON.stringify(userData),
        });
  
        // Comprehensive response logging
        console.group('Login Response');
        console.log('Response Status:', res.status);
        console.log('Response Headers:', Object.fromEntries(res.headers.entries()));
        console.groupEnd();
  
        // Detailed error handling
        if (!res.ok) {
          const errorText = await res.text();
          
          console.group('Login Error Details');
          console.error('Error Status:', res.status);
          console.error('Error Text:', errorText);
          console.groupEnd();
  
          // Provide more specific error messages
          switch (res.status) {
            case 401:
              return thunkAPI.rejectWithValue("Invalid email or password");
            case 403:
              return thunkAPI.rejectWithValue("Access forbidden");
            case 500:
              return thunkAPI.rejectWithValue("Server error. Please try again later.");
            default:
              return thunkAPI.rejectWithValue(errorText || "Login failed");
          }
        }
  
        // Parse response data
        let data;
        try {
          data = await res.json();
          console.log('Parsed Response Data:', data);
        } catch (parseError) {
          console.error('JSON Parsing Error:', parseError);
          return thunkAPI.rejectWithValue("Invalid server response");
        }
  
        // Validate token
        if (!data.token) {
          console.error('No token in response:', data);
          return thunkAPI.rejectWithValue("Authentication token missing");
        }
  
        // Comprehensive user object creation
        const userWithToken = {
          id: data.id || data._id,
          name: data.name,
          email: data.email,
          token: data.token
        };
  
        // Secure token storage
        try {
          localStorage.setItem("user", JSON.stringify(userWithToken));
          localStorage.setItem("token", data.token);
        } catch (storageError) {
          console.error('Local Storage Error:', storageError);
          return thunkAPI.rejectWithValue("Unable to store authentication data");
        }
  
        return userWithToken;
      } catch (error) {
        // Network or unexpected errors
        console.group('Unexpected Login Error');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        console.groupEnd();
  
        // Specific network error handling
        if (error.name === 'TypeError') {
          return thunkAPI.rejectWithValue(
            "Network error. Please check your internet connection."
          );
        }
  
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred during login"
        );
      }
    }
  );
// 🚀 Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {

      const response = await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include", // ✅ Required to send cookies
        headers: {
          "Content-Type": "application/json"
        }
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

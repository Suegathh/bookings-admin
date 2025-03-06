import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://bookings-backend-g8dm.onrender.com";

// Fetch user data from localStorage safely
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

// Helper function for timeouts
const fetchWithTimeout = async (url, options, timeout = 15000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// 🚀 Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
          credentials: "include",
        },
        20000 // 20 second timeout
      );

      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || "Registration failed";
        } catch (e) {
          errorMessage = `Registration failed (${res.status})`;
        }
        return thunkAPI.rejectWithValue(errorMessage);
      }

      const userData = await res.json();
      // Store user in localStorage (but without password)
      const { password, ...userWithoutPassword } = userData;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      return userWithoutPassword;
    } catch (error) {
      // Handle timeout specifically
      if (error.name === "AbortError") {
        return thunkAPI.rejectWithValue("Request timed out. Server might be starting up, please try again.");
      }
      
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// 🚀 Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      console.group('Login Request Details');
      console.log('API URL:', `${API_URL}/api/users/login`);
      console.log('Request Payload:', {
        email: userData.email,
        passwordLength: userData.password ? userData.password.length : 0
      });
      console.groupEnd();

      // Detailed fetch configuration with timeout
      const res = await fetchWithTimeout(
        `${API_URL}/api/users/login`,
        {
          method: "POST",
          credentials: 'include',
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
        20000 // 20 second timeout for login
      );

      // Comprehensive response logging
      console.group('Login Response');
      console.log('Response Status:', res.status);
      console.log('Response Headers:', Object.fromEntries(res.headers.entries()));
      console.groupEnd();

      // Detailed error handling
      if (!res.ok) {
        let errorText;
        try {
          const errorData = await res.json();
          errorText = errorData.message || "Login failed";
        } catch (e) {
          errorText = await res.text();
        }
        
        console.group('Login Error Details');
        console.error('Error Status:', res.status);
        console.error('Error Text:', errorText);
        console.groupEnd();

        // Match error messages from your controller
        switch (res.status) {
          case 400:
            if (errorText.includes("User not found")) {
              return thunkAPI.rejectWithValue("User not found");
            }
            if (errorText.includes("Incorrect password")) {
              return thunkAPI.rejectWithValue("Incorrect password");
            }
            return thunkAPI.rejectWithValue(errorText || "Login failed");
          case 500:
            return thunkAPI.rejectWithValue("Server error. Please try again later.");
          default:
            return thunkAPI.rejectWithValue(errorText || `Login failed (${res.status})`);
        }
      }

      // Parse response data
      let data;
      try {
        data = await res.json();
        console.log('Parsed Response Data:', data);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        return thunkAPI.rejectWithValue("Invalid server response format");
      }

      // Validate token
      if (!data.token) {
        console.error('No token in response:', data);
        return thunkAPI.rejectWithValue("Authentication token missing");
      }

      // Create user object that matches your controller response
      const userWithToken = {
        _id: data._id,
        name: data.name,
        email: data.email,
        token: data.token
      };

      // Store both user and token
      try {
        localStorage.setItem("user", JSON.stringify(userWithToken));
        localStorage.setItem("token", data.token);
      } catch (storageError) {
        console.error('Local Storage Error:', storageError);
        return thunkAPI.rejectWithValue("Unable to store authentication data");
      }

      return userWithToken;
    } catch (error) {
      // Specific handling for timeout
      if (error.name === "AbortError") {
        console.error('Request timed out:', error);
        return thunkAPI.rejectWithValue(
          "Request timed out. The server might be starting up, please try again in a moment."
        );
      }
      
      // Network or unexpected errors
      console.group('Unexpected Login Error');
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.groupEnd();

      // Specific network error handling
      if (error.name === 'TypeError') {
        return thunkAPI.rejectWithValue(
          "Network error. Please check your internet connection or the server might be down."
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
      const response = await fetchWithTimeout(
        `${API_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        },
        10000 // 10 second timeout
      );
      
      console.log("Logout Response:", response.status, response.statusText);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = "Logout failed";
        }
        console.error("Logout Error:", errorText);
        
        // Even if server logout fails, clear local storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        return thunkAPI.rejectWithValue(errorText || "Logout failed");
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout Error:", error);
      
      // Even if there's a network error, clear local storage for client-side logout
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      if (error.name === "AbortError") {
        return { success: true, message: "Logged out locally (server timeout)" };
      }
      
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Check token validity at app startup
export const checkTokenValidity = createAsyncThunk(
  "auth/checkToken",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    
    // If no token exists, no need to check
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetchWithTimeout(
        `${API_URL}/api/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        },
        10000
      );
      
      if (!response.ok) {
        // Token is invalid, clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      }
      
      const userData = await response.json();
      return {
        ...userData,
        token
      };
    } catch (error) {
      // Network error, but don't logout user automatically
      console.error("Token validation error:", error);
      return thunkAPI.rejectWithValue("Unable to validate session");
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
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
    localLogout: (state) => {
      state.user = null;
      state.isSuccess = true;
      state.message = "Logged out locally";
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      // 🚀 Register Cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
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
        state.isError = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
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
        // Even with server errors, clear the user
        state.user = null;
      })

      // 🚀 Token Check Cases
      .addCase(checkTokenValidity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkTokenValidity.fulfilled, (state, action) => {
        state.isLoading = false;
        // Only update user if we got valid data back
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(checkTokenValidity.rejected, (state) => {
        state.isLoading = false;
        // Don't set error state for token validation failures
      });
  },
});

export const { reset, clearError, localLogout } = authSlice.actions;
export default authSlice.reducer;
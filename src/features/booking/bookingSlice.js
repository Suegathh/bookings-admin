import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No token found in localStorage!");
  }
  return token;
};


const initialState = {
  bookings: [],
  booking: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const API_URL = "https://bookings-backend-g8dm.onrender.com";



// Create Booking
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkApi) => {
    try {
      const token = getToken();
      if (!token) return thunkApi.rejectWithValue("No token found, please log in.");

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (!res.ok) return thunkApi.rejectWithValue(data);

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Get All Bookings
export const getBookings = createAsyncThunk(
  "booking/getbookings",
  async (_, thunkApi) => {
    try {
      const token = getToken();
      if (!token) return thunkApi.rejectWithValue("No token found, please log in.");

      console.log("📡 Fetching bookings...");
      console.log("🔑 Sending Token:", token);

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensures cookies are sent with the request
      });
      

      const data = await res.json();

      console.log("📡 Booking Fetch Response");
      console.log("Response Status:", res.status);
      console.log("Response Headers:", res.headers);
      console.log("Response Body:", data);

      if (!res.ok) {
        if (res.status === 401) {
          console.error("🚨 Unauthorized Access Detected");
        }
        return thunkApi.rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);


// Delete Booking
export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async (id, thunkApi) => {
    try {
      const token = getToken();
      if (!token) return thunkApi.rejectWithValue("No token found, please log in.");

      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return thunkApi.rejectWithValue(data);

      return id; // Return only the deleted booking ID
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Confirm Booking
export const confirmBooking = createAsyncThunk(
  "booking/confirm",
  async (bookingId, thunkApi) => {
    try {
      const token = getToken();
      if (!token) return thunkApi.rejectWithValue("No token found, please log in.");

      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ confirmed: true }),
      });
      

      const data = await res.json();
      if (!res.ok) return thunkApi.rejectWithValue(data);

      return { bookingId, confirmed: true };
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const bookingSlice = createSlice({
  name: "booking",
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
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBookings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        console.log("✅ Bookings fetched successfully:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
        state.isError = false;
      })
      
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.bookings = [];
        state.message = typeof action.payload === 'string' 
          ? action.payload 
          : "Authentication failed. Please log in again.";
      })
      .addCase(deleteBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.filter(
          (booking) => booking._id !== action.payload
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(confirmBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.bookingId
            ? { ...booking, confirmed: true }
            : booking
        );
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = bookingSlice.actions;
export default bookingSlice.reducer;

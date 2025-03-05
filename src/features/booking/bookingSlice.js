import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  booking: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const API_URL = "https://booking-backend-bice.vercel.app/api/bookings";

// Helper function to get token
const getToken = () => localStorage.getItem("token");

// Create Booking
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkApi) => {
    try {
      const token = getToken();
      if (!token) return thunkApi.rejectWithValue("No token found, please log in.");

      const res = await fetch(`${API_URL}`, {
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

      const res = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return thunkApi.rejectWithValue(data);

      return data;
    } catch (error) {
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

      const res = await fetch(`${API_URL}/${id}`, {
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

      const res = await fetch(`${API_URL}/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  booking: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const API_URL = "https://booking-backend-bice.vercel.app"

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, thunkApi) => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkApi.rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
export const getBookings = createAsyncThunk(
  "booking/getbookings",
  async (_, thunkApi) => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        return thunkApi.rejectWithValue("No token found, please log in.");
      }

      const res = await fetch(`${API_URL}/bookings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include", // Send cookies if needed
      });

      const data = await res.json();
      if (!res.ok) {
        return thunkApi.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async (id, thunkApi) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        headers: {
          "Content-type": "application/json",
        },
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkApi.rejectWithValue(data);
      }

      return data;
    } catch (error) {
      console.log(error.message);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const confirmBooking = createAsyncThunk(
  "booking/confirm",
  async (bookingId, thunkApi) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ confirmed: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkApi.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// booking slice
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
          (booking) => booking._id.toString() !== action.payload.id
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(confirmBooking.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
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
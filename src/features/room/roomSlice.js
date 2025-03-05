import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://bookings-backend-g8dm.onrender.com"

const initialState = {
  rooms: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};
// Generic error handler
const handleFetchError = async (response, thunkApi) => {
  let errorMessage = "An unknown error occurred";
  try {
    const errorData = await response.text();
    errorMessage = errorData || `HTTP error! status: ${response.status}`;
  } catch (e) {
    console.error("Error parsing error response", e);
  }
  console.error("API Error:", errorMessage);
  return thunkApi.rejectWithValue(errorMessage);
};

// Create room
// Create room
export const createRoom = createAsyncThunk(
  "rooms/create",
  async (roomData, thunkAPI) => {
    try {
      // Remove token from body before sending
      const { token, ...dataToSend } = roomData;

      const response = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Get all rooms
export const getRooms = createAsyncThunk(
  "room/getall", 
  async (_, thunkApi) => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`, { 
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`
        }
      });

      if (!res.ok) {
        return handleFetchError(res, thunkApi);
      }
      return await res.json();
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);


// Update room
export const updateRoom = createAsyncThunk("room/update", async (roomData, thunkApi) => {
  try {
    const { roomId, ...rest } = roomData;
    const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`,
      },
      credentials: "include",
      body: JSON.stringify(rest),
    });
    
    if (!res.ok) {
      const error = await res.json();
      return thunkApi.rejectWithValue(error);
    }

    return await res.json();
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

// Delete room
export const deleteRoom = createAsyncThunk("room/delete", async (roomId, thunkApi) => {
  try {
    const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`,
      },
      credentials: "include",
    });
    

    if (!res.ok) {
      const error = await res.json();
      return thunkApi.rejectWithValue(error);
    }

    return { id: roomId }; // ✅ Ensure backend sends ID in response
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room
        );
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rooms = state.rooms.filter((room) => room._id !== action.payload.id);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = roomSlice.actions;
export default roomSlice.reducer;

import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import { fetchCount } from './counterAPI';

// Initial state
const initialState = {
  value: 0,
  status: 'idle', // Can be 'idle', 'loading', or 'failed'
  error: null, // Store error messages
};

// Async thunk function for fetching count
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await fetchCount(amount);
      return response.data; // Ensure the response contains 'data'
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors properly
    }
  }
);

// Create slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Memoized selector for performance optimization
export const selectCount = createSelector(
  (state) => state.counter,
  (counter) => counter.value
);

// Thunk for conditional dispatching
export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

// Export reducer
export default counterSlice.reducer;

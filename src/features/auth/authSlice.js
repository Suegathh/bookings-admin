import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch user data from localStorage
const user = JSON.parse(localStorage.getItem("user")) || null;

// Register User
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkApi) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: "include" // ✅ Ensures cookies (auth token) are handled
        });

        if (!res.ok) {
            const error = await res.json();
            return thunkApi.rejectWithValue(error.message || "Registration failed");
        }

        const data = await res.json();
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message || "Something went wrong during registration");
    }
});

// Login User
export const loginUser = createAsyncThunk("auth/login", async (userData, thunkApi) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include", // ✅ Ensures cookies (auth token) are handled
        });

        if (!res.ok) {
            const error = await res.json();
            return thunkApi.rejectWithValue(error.message || "Login failed");
        }

        const data = await res.json();

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message || "Something went wrong during login");
    }
});

// Logout User
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkApi) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
            method: "GET",
            credentials: "include", // ✅ Ensures cookies are cleared properly
        });

        if (!res.ok) {
            const error = await res.json();
            return thunkApi.rejectWithValue(error.message || "Logout failed");
        }

        const data = await res.json();

        // Remove user from localStorage
        localStorage.removeItem("user");

        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message || "Something went wrong during logout");
    }
});

// Initial state
const initialState = {
    user,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
};

// Create Redux slice
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
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user"); // ✅ Ensure localStorage is cleared on logout
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
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

            // Login
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

            // Logout
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

// Export actions
export const { reset } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

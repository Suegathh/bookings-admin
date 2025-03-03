import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));

export const registerUser = createAsyncThunk("auth/register", async (userData, thunkApi) => {
    try {
        const res = await fetch("/api/users", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(userData)
        });

        if (!res.ok) {
            const error = await res.json();
            return thunkApi.rejectWithValue(error.message || "Registration failed");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message || "Something went wrong during registration");
    }
});

export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, thunkApi) => {
        try {
            const res = await fetch("/api/users/login", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const error = await res.json();
                return thunkApi.rejectWithValue(error.message || "Login failed");
            }

            const data = await res.json();

            // set the data in localStorage
            localStorage.setItem("user", JSON.stringify(data));
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(error.message || "Something went wrong during login");
        }
    }
);

// Logout User action
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkApi) => {
    try {
        const res = await fetch("/api/users/logout");

        if (!res.ok) {
            const error = await res.json();
            return thunkApi.rejectWithValue(error.message || "Logout failed");
        }

        const data = await res.json();  
        localStorage.removeItem("user");  

        return data;  
    } catch (error) {
        return thunkApi.rejectWithValue(error.message || "Something went wrong during logout");
    }
});

const initialState = {
    user: user ? user : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
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
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user"); // Clear user from localStorage
        }
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
                state.message = action.payload;
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
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

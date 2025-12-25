// store/designSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosinstance";

// ---------------------
// Async Thunks
// ---------------------
export const fetchDesigns = createAsyncThunk(
  "designs/fetchDesigns",
  async (userId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axiosInstance.get(`/api/designs?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

export const createDesign = createAsyncThunk(
  "designs/createDesign",
  async (data, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axiosInstance.post(`/api/designs`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create failed");
    }
  }
);

export const updateDesign = createAsyncThunk(
  "designs/updateDesign",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axiosInstance.put(`/api/designs/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

export const deleteDesign = createAsyncThunk(
  "designs/deleteDesign",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.delete(`/api/designs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

// ---------------------
// Slice
// ---------------------
const initialState = {
  list: [],
  selected: null,
  status: "idle",
  error: null,
};

const designSlice = createSlice({
  name: "designs",
  initialState,
  reducers: {
    setSelectedDesign: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigns.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createDesign.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        const idx = state.list.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e._id !== action.payload);
      });
  },
});

export const { setSelectedDesign } = designSlice.actions;
export default designSlice.reducer;

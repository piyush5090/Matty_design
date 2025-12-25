import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  user: null,
  isAdmin: false,
  allUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setAdmin:(state,action)=>{
      state.isAdmin = action.payload;
    },
    setAllUsers: (state, action)=>{
      state.allUsers = action.payload;
    }
  }
});

export const { setUser, logout, setAdmin, setAllUsers } = userSlice.actions;
export default userSlice.reducer;

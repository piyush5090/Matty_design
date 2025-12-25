// src/store/shapesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shapes: [],
  history: [],
  future: [],
};

const shapesSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    addShape(state, action) {
      state.history.push(JSON.stringify(state.shapes));
      state.shapes.push(action.payload);
      state.future = [];
    },
    updateShape(state, action) {
      const { id, newAttrs } = action.payload;
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = state.shapes.map((s) =>
        s.id === id ? { ...s, ...newAttrs } : s
      );
      state.future = [];
    },
    removeShape(state, action) {
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = state.shapes.filter((s) => s.id !== action.payload);
      state.future = [];
    },
    clearShapes(state) {
      state.history.push(JSON.stringify(state.shapes));
      state.shapes = [];
      state.future = [];
    },
    setShapes(state, action) {
      state.shapes = action.payload;
    },
    undo(state) {
      if (state.history.length === 0) return;
      state.future.push(JSON.stringify(state.shapes));
      const prev = JSON.parse(state.history.pop());
      state.shapes = prev;
    },
    redo(state) {
      if (state.future.length === 0) return;
      state.history.push(JSON.stringify(state.shapes));
      const next = JSON.parse(state.future.pop());
      state.shapes = next;
    },
    replaceAll(state, action) {
      state.shapes = action.payload;
      state.history = [];
      state.future = [];
    },
  },
});

export const {
  addShape,
  updateShape,
  removeShape,
  clearShapes,
  undo,
  redo,
  setShapes,
  replaceAll,
} = shapesSlice.actions;
export default shapesSlice.reducer;

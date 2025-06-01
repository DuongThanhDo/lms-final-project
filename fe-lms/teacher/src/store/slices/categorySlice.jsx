import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { configs } from "../../configs";

export const fetchCategories = createAsyncThunk("categories/fetch", async () => {
  const response = await axios.get(`${configs.API_BASE_URL}/categories`);
  return response.data;
});

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;

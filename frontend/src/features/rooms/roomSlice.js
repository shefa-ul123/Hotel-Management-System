import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (params, thunkAPI) => {
  try {
    let url = 'http://localhost:5000/api/rooms';
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      if (queryParams) url += `?${queryParams}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
  }
});

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch rooms';
      });
  },
});

export default roomSlice.reducer;

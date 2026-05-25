import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createServiceRequest = createAsyncThunk('services/createServiceRequest', async (serviceData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post('http://localhost:5000/api/services', serviceData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetServiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceRequest.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.services.push(action.payload);
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create request';
      });
  },
});

export const { resetServiceState } = serviceSlice.actions;
export default serviceSlice.reducer;

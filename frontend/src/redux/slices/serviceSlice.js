import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    currentService: null,
    myServices: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setServices: (state, action) => { state.services = action.payload; },
    setCurrentService: (state, action) => { state.currentService = action.payload; },
    setMyServices: (state, action) => { state.myServices = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setLoading, setServices, setCurrentService, setMyServices, setError } = serviceSlice.actions;
export default serviceSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setBids: (state, action) => { state.bids = action.payload; },
    setMyBids: (state, action) => { state.myBids = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setLoading, setBids, setMyBids, setError } = bidSlice.actions;
export default bidSlice.reducer;

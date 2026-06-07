import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    currentPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setPayments: (state, action) => { state.payments = action.payload; },
    setCurrentPayment: (state, action) => { state.currentPayment = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setLoading, setPayments, setCurrentPayment, setError } = paymentSlice.actions;
export default paymentSlice.reducer;

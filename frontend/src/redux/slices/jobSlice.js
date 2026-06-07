import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    currentJob: null,
    myJobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setJobs: (state, action) => { state.jobs = action.payload; },
    setCurrentJob: (state, action) => { state.currentJob = action.payload; },
    setMyJobs: (state, action) => { state.myJobs = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setLoading, setJobs, setCurrentJob, setMyJobs, setError } = jobSlice.actions;
export default jobSlice.reducer;

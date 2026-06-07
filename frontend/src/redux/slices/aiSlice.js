import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';

export const fetchJobRecommendations = createAsyncThunk(
  'ai/fetchJobRecommendations',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await aiService.getJobRecommendations(limit);
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const fetchBiddingSuggestions = createAsyncThunk(
  'ai/fetchBiddingSuggestions',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await aiService.getBiddingSuggestions(jobId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
);

export const fetchFreelancerRecommendations = createAsyncThunk(
  'ai/fetchFreelancerRecommendations',
  async ({ jobId, limit }, { rejectWithValue }) => {
    try {
      const { data } = await aiService.getFreelancerRecommendations(jobId, limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch freelancers');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    jobRecommendations: [],
    biddingSuggestions: null,
    freelancerRecommendations: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuggestions: (state) => {
      state.biddingSuggestions = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.jobRecommendations = action.payload?.recommendations || action.payload || [];
      })
      .addCase(fetchJobRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBiddingSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBiddingSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.biddingSuggestions = action.payload || null;
      })
      .addCase(fetchBiddingSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFreelancerRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFreelancerRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.freelancerRecommendations = action.payload?.recommendations || [];
      })
      .addCase(fetchFreelancerRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuggestions } = aiSlice.actions;
export default aiSlice.reducer;

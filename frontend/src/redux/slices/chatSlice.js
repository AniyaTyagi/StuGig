import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: [],
    onlineUsers: [],
    loading: false,
  },
  reducers: {
    setConversations: (state, action) => { state.conversations = action.payload; },
    setCurrentConversation: (state, action) => { state.currentConversation = action.payload; },
    setMessages: (state, action) => { state.messages = action.payload; },
    addMessage: (state, action) => { state.messages.push(action.payload); },
    setOnlineUsers: (state, action) => { state.onlineUsers = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
  },
});

export const { setConversations, setCurrentConversation, setMessages, addMessage, setOnlineUsers, setLoading } = chatSlice.actions;
export default chatSlice.reducer;

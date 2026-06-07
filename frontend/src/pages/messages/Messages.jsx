import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { messageService } from '../../services';
import socketService from '../../services/socketService';
import {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  setOnlineUsers,
  setLoading
} from '../../redux/slices/chatSlice';
import { Send, User, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const Messages = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { conversations, currentConversation, messages, loading } = useSelector((state) => state.chat);
  
  const [text, setText] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Connect to sockets
    socketService.connect();

    // Listeners
    socketService.on('newMessage', (message) => {
      if (currentConversation && message.conversationId === currentConversation._id) {
        dispatch(addMessage(message));
        // Mark as read on backend
        messageService.markAsRead(currentConversation._id).catch(() => {});
      }
      // Re-fetch conversations to update preview and unread count
      fetchConversations();
    });

    socketService.on('userTyping', (data) => {
      if (currentConversation && data.conversationId === currentConversation._id) {
        // Find other user in conversation
        const otherUser = currentConversation.participants?.find(p => p._id !== user._id);
        if (otherUser && data.userId === otherUser._id) {
          setTypingUser(otherUser);
        }
      }
    });

    socketService.on('userStoppedTyping', (data) => {
      if (currentConversation && data.conversationId === currentConversation._id) {
        setTypingUser(null);
      }
    });

    fetchConversations();

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, currentConversation]);

  // Auto-select conversation if userId provided in location state
  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (targetUserId && conversations.length > 0 && user?._id) {
      const existingConv = conversations.find(conv => 
        conv.participants?.some(p => p._id === targetUserId)
      );
      if (existingConv) {
        handleSelectConversation(existingConv);
      }
    }
  }, [conversations, location.state, user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await messageService.getConversations();
      dispatch(setConversations(response.data || response || []));
    } catch (err) {
      toast.error('Failed to load chat conversations');
    }
  };

  const handleSelectConversation = async (conv) => {
    dispatch(setCurrentConversation(conv));
    dispatch(setLoading(true));
    setTypingUser(null);
    try {
      // Join conversation room via socket
      socketService.joinConversation(conv._id);
      
      const response = await messageService.getMessages(conv._id);
      dispatch(setMessages(response.data || response || []));
      
      // Mark read
      await messageService.markAsRead(conv._id);
    } catch (err) {
      toast.error('Failed to load conversation messages');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentConversation) return;

    const otherUser = currentConversation.participants?.find(p => p._id !== user._id);
    if (!otherUser) return;

    const messageData = {
      receiverId: otherUser._id,
      content: text.trim()
    };

    try {
      // Send through REST endpoint (which persists in DB)
      const response = await messageService.sendMessage(messageData);
      const messageObj = response.data || response;
      
      // Emit via socket for real-time delivery
      socketService.sendMessage({
        conversationId: currentConversation._id,
        content: text.trim(),
        receiverId: otherUser._id
      });
      
      dispatch(addMessage(messageObj));
      setText('');
      
      // Stop typing immediately
      socketService.stopTyping({ conversationId: currentConversation._id });
      
      // Update conversations sidebar
      fetchConversations();
    } catch (err) {
      console.error('Send message error:', err);
      toast.error(err?.message || 'Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!currentConversation) return;

    // Emit typing event
    socketService.typing({ conversationId: currentConversation._id });

    // Debounce stop-typing event
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping({ conversationId: currentConversation._id });
    }, 2000);
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find(p => p._id !== user?._id) || { firstName: 'User', lastName: '' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-xl flex-1 flex overflow-hidden border border-gray-100">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-150 flex flex-col bg-gray-50/50">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const partner = getOtherParticipant(conv);
                const isSelected = currentConversation?._id === conv._id;
                const hasUnread = conv.unreadCount > 0 && conv.lastMessage?.sender !== user?._id;
                
                return (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left p-5 flex items-center gap-4 transition-all duration-200 ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {partner.firstName?.charAt(0)}{partner.lastName?.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
                          {partner.firstName} {partner.lastName}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {conv.lastMessage && new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate flex-1 pr-4 ${hasUnread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                          {conv.lastMessage?.sender === user?._id && <span className="text-gray-400 mr-1">You:</span>}
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                        
                        {hasUnread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No active conversations yet.
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shadow-sm bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {getOtherParticipant(currentConversation).firstName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-850">
                      {getOtherParticipant(currentConversation).firstName} {getOtherParticipant(currentConversation).lastName}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {typingUser ? 'typing...' : 'Active now'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                {loading ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    Loading chat messages...
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => {
                      const isOwn = msg.senderId === user?._id || msg.sender === user?._id;
                      
                      return (
                        <div key={msg._id || index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                            isOwn 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <span className={`text-[10px] block mt-1.5 text-right ${
                              isOwn ? 'text-indigo-250 opacity-80' : 'text-gray-400'
                            }`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {typingUser && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-200"></span>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 bg-gray-55 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
              <User size={64} className="mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-500">Select a conversation to start chatting</p>
              <p className="text-sm text-gray-400 mt-1">Real-time collaboration is just a click away.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;

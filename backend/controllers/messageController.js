const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, attachments } = req.body;
    const senderId = req.user._id;
    
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });
    
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        unreadCount: new Map([[receiverId.toString(), 0]])
      });
    }
    
    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content,
      attachments
    });
    
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = message.createdAt;
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    await conversation.save();
    
    await message.populate([
      { path: 'sender', select: 'firstName lastName avatar' },
      { path: 'receiver', select: 'firstName lastName avatar' }
    ]);

    // Add conversationId for socket event
    const messageObj = message.toObject();
    messageObj.conversationId = conversation._id;
    messageObj.senderId = senderId;
    
    res.status(201).json({
      success: true,
      data: messageObj
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'firstName lastName avatar lastActive')
    .populate('lastMessage')
    .sort({ lastMessageTime: -1 });
    
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/messages/:conversationId/read
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    await Message.updateMany(
      { conversation: conversationId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
    
    const conversation = await Conversation.findById(conversationId);
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  sendMessage, 
  getConversations, 
  getMessages, 
  markAsRead 
};

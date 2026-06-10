require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const connectDB = require('./config/db');
const initSocket = require('./socket/socket');
const { errorHandler } = require('./middlewares/error');
const { rateLimiter } = require('./middlewares/rateLimiter.middleware');
const { sanitizeInput } = require('./middlewares/sanitize');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB (non-blocking)
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      connectSrc: ["'self'", "https://stugig.onrender.com", "wss://stugig.onrender.com", "wss://*", "https://*"],
      frameSrc: ["https://api.razorpay.com"]
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://stugig-frontend.vercel.app",
        /https:\/\/stugig-frontend.*\.vercel\.app$/
      ];
      
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin matches allowed patterns
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api', rateLimiter);
app.use('/api', sanitizeInput);

// API v1 Routes (Recommended)
const API_VERSION = '/v1';
app.use(`/api${API_VERSION}/auth`, require('./routes/auth.routes'));
app.use(`/api${API_VERSION}/users`, require('./routes/user.routes'));
app.use(`/api${API_VERSION}/services`, require('./routes/service.routes'));
app.use(`/api${API_VERSION}/jobs`, require('./routes/job.routes'));
app.use(`/api${API_VERSION}/bids`, require('./routes/bid.routes'));
app.use(`/api${API_VERSION}/messages`, require('./routes/message.routes'));
app.use(`/api${API_VERSION}/payments`, require('./routes/payment.routes'));
app.use(`/api${API_VERSION}/reviews`, require('./routes/review.routes'));
app.use(`/api${API_VERSION}/notifications`, require('./routes/notification.routes'));
app.use(`/api${API_VERSION}/admin`, require('./routes/admin.routes'));
app.use(`/api${API_VERSION}/ai`, require('./routes/ai.routes'));
app.use(`/api${API_VERSION}/invitations`, require('./routes/invitation.routes'));

// TEMPORARY FIX ROUTE - DELETE AFTER USE
app.use('/api/temp', require('./routes/temp-fix'));

// Legacy routes (backward compatibility)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/services', require('./routes/service.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/bids', require('./routes/bid.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/invitations', require('./routes/invitation.routes'));

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const io = initSocket(server);
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

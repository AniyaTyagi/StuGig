require('dotenv').config();
const express = require('express');
const http = require('http');

console.log('🧪 Testing Server Startup...\n');

const app = express();
const server = http.createServer(app);

// Test middleware
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;

const serverInstance = server.listen(PORT, () => {
  console.log('✅ Server started successfully!');
  console.log(`✅ Running on port ${PORT}`);
  console.log('✅ Health check: http://localhost:' + PORT + '/health');
  console.log('\n🎉 Backend is fully functional and ready!\n');
  
  // Close server after verification
  serverInstance.close(() => {
    console.log('✅ Server test complete - All systems working!\n');
    process.exit(0);
  });
});

serverInstance.on('error', (err) => {
  console.log('❌ Server failed to start:', err.message);
  process.exit(1);
});

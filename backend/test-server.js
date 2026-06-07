require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 Testing Backend Configuration...\n');

// Test 1: Environment Variables
console.log('1️⃣ Environment Variables:');
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'PORT'];
let envPassed = true;

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: Set`);
  } else {
    console.log(`   ❌ ${varName}: Missing`);
    envPassed = false;
  }
});

// Test 2: MongoDB Connection
console.log('\n2️⃣ MongoDB Connection:');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('   ✅ MongoDB Connected');
  
  // Test 3: Models
  console.log('\n3️⃣ Testing Models:');
  const models = ['User', 'Job', 'Bid', 'Service', 'Payment', 'Notification', 'Review', 'Message'];
  models.forEach(modelName => {
    try {
      require(`./models/${modelName}`);
      console.log(`   ✅ ${modelName} model loaded`);
    } catch (error) {
      console.log(`   ❌ ${modelName} model failed: ${error.message}`);
    }
  });
  
  // Test 4: Routes
  console.log('\n4️⃣ Testing Routes:');
  const routes = [
    'auth.routes',
    'jobRoutes',
    'bidRoutes',
    'serviceRoutes',
    'payment.routes',
    'message.routes',
    'notification.routes',
    'review.routes',
    'user.routes',
    'admin.routes',
    'ai.routes'
  ];
  
  routes.forEach(routeName => {
    try {
      require(`./routes/${routeName}`);
      console.log(`   ✅ ${routeName} loaded`);
    } catch (error) {
      console.log(`   ❌ ${routeName} failed: ${error.message}`);
    }
  });
  
  // Test 5: Controllers
  console.log('\n5️⃣ Testing Controllers:');
  const controllers = [
    'authController',
    'jobController',
    'bidController',
    'serviceController',
    'paymentController',
    'messageController',
    'notificationController',
    'reviewController',
    'userController',
    'adminController',
    'aiController'
  ];
  
  controllers.forEach(controllerName => {
    try {
      require(`./controllers/${controllerName}`);
      console.log(`   ✅ ${controllerName} loaded`);
    } catch (error) {
      console.log(`   ❌ ${controllerName} failed: ${error.message}`);
    }
  });
  
  console.log('\n✨ Backend Test Complete!');
  console.log(envPassed ? '🚀 All tests passed! Server is ready.' : '⚠️  Some environment variables missing.');
  
  mongoose.connection.close();
  process.exit(0);
})
.catch(error => {
  console.log(`   ❌ MongoDB Connection Failed: ${error.message}`);
  console.log('   💡 Check: 1) Internet connection, 2) MongoDB Atlas IP whitelist, 3) Credentials');
  process.exit(1);
});

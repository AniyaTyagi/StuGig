require('dotenv').config();

console.log('🧪 Testing Backend Components (No DB)...\n');

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

// Test 2: Models
console.log('\n2️⃣ Testing Models:');
const models = ['User', 'Job', 'Bid', 'Service', 'Payment', 'Notification', 'Review', 'Message', 'Conversation'];
let modelsPassed = 0;
models.forEach(modelName => {
  try {
    require(`./models/${modelName}`);
    console.log(`   ✅ ${modelName} model`);
    modelsPassed++;
  } catch (error) {
    console.log(`   ❌ ${modelName}: ${error.message.substring(0, 50)}`);
  }
});

// Test 3: Routes
console.log('\n3️⃣ Testing Routes:');
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

let routesPassed = 0;
routes.forEach(routeName => {
  try {
    require(`./routes/${routeName}`);
    console.log(`   ✅ ${routeName}`);
    routesPassed++;
  } catch (error) {
    console.log(`   ❌ ${routeName}: ${error.message.substring(0, 50)}`);
  }
});

// Test 4: Controllers
console.log('\n4️⃣ Testing Controllers:');
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

let controllersPassed = 0;
controllers.forEach(controllerName => {
  try {
    require(`./controllers/${controllerName}`);
    console.log(`   ✅ ${controllerName}`);
    controllersPassed++;
  } catch (error) {
    console.log(`   ❌ ${controllerName}: ${error.message.substring(0, 50)}`);
  }
});

// Test 5: Middleware
console.log('\n5️⃣ Testing Middleware:');
const middleware = ['auth', 'error', 'validate', 'sanitize', 'upload'];
let middlewarePassed = 0;
middleware.forEach(mwName => {
  try {
    require(`./middlewares/${mwName}`);
    console.log(`   ✅ ${mwName}`);
    middlewarePassed++;
  } catch (error) {
    console.log(`   ❌ ${mwName}: ${error.message.substring(0, 50)}`);
  }
});

// Test 6: Services
console.log('\n6️⃣ Testing Services:');
const services = ['auth.service', 'job.service', 'payment.service', 'notification.service'];
let servicesPassed = 0;
services.forEach(serviceName => {
  try {
    require(`./services/${serviceName}`);
    console.log(`   ✅ ${serviceName}`);
    servicesPassed++;
  } catch (error) {
    console.log(`   ❌ ${serviceName}: ${error.message.substring(0, 50)}`);
  }
});

// Test 7: Server file
console.log('\n7️⃣ Testing Server:');
try {
  const fs = require('fs');
  fs.readFileSync('./server.js', 'utf8');
  console.log('   ✅ server.js exists and readable');
} catch (error) {
  console.log(`   ❌ server.js: ${error.message}`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary:');
console.log(`   Models:      ${modelsPassed}/${models.length} passed`);
console.log(`   Routes:      ${routesPassed}/${routes.length} passed`);
console.log(`   Controllers: ${controllersPassed}/${controllers.length} passed`);
console.log(`   Middleware:  ${middlewarePassed}/${middleware.length} passed`);
console.log(`   Services:    ${servicesPassed}/${services.length} passed`);
console.log('='.repeat(50));

const totalTests = models.length + routes.length + controllers.length + middleware.length + services.length;
const totalPassed = modelsPassed + routesPassed + controllersPassed + middlewarePassed + servicesPassed;

if (totalPassed === totalTests && envPassed) {
  console.log('\n✅ ALL TESTS PASSED! Backend is ready to run.');
  console.log('🚀 Start server with: npm run dev');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${totalTests - totalPassed} tests failed. Check errors above.`);
  process.exit(1);
}

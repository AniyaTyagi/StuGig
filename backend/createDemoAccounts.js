require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const demoAccounts = [
  // Admin Account
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@stugig.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Platform administrator with full access to all features and settings.',
    isVerified: true,
    isEmailVerified: true
  },
  // Student/Freelancer Accounts
  {
    firstName: 'Alex',
    lastName: 'Developer',
    email: 'alex@demo.com',
    password: 'demo123',
    role: 'student',
    bio: 'Full-stack web developer specializing in React and Node.js. Available for freelance projects.',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Express'],
    university: 'Stanford University',
    hourlyRate: 50,
    balance: 1000,
    rating: 4.8,
    reviewCount: 15
  },
  {
    firstName: 'Sarah',
    lastName: 'Designer',
    email: 'sarah@demo.com',
    password: 'demo123',
    role: 'student',
    bio: 'Creative UI/UX designer passionate about crafting beautiful user experiences.',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design', 'Prototyping'],
    university: 'MIT',
    hourlyRate: 45,
    balance: 800,
    rating: 4.9,
    reviewCount: 22
  },
  {
    firstName: 'Mike',
    lastName: 'Mobile',
    email: 'mike@demo.com',
    password: 'demo123',
    role: 'student',
    bio: 'Mobile app developer experienced in React Native and Flutter.',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    university: 'UC Berkeley',
    hourlyRate: 55,
    balance: 1200,
    rating: 4.7,
    reviewCount: 18
  },
  // Client/Startup Accounts
  {
    firstName: 'Tech',
    lastName: 'Startup',
    email: 'client@demo.com',
    password: 'demo123',
    role: 'startup',
    companyName: 'Demo Tech Inc',
    industry: 'Technology',
    teamSize: 10,
    fundingStage: 'Series A',
    bio: 'Fast-growing SaaS startup looking for talented developers.',
    balance: 5000
  },
  {
    firstName: 'Digital',
    lastName: 'Agency',
    email: 'agency@demo.com',
    password: 'demo123',
    role: 'recruiter',
    companyName: 'Demo Digital Agency',
    industry: 'Marketing',
    teamSize: 25,
    bio: 'Full-service digital agency seeking freelancers for client projects.',
    balance: 3000
  }
];

const createDemoAccounts = async () => {
  try {
    await connectDB();

    console.log('\n🔧 Creating demo accounts...\n');

    for (const account of demoAccounts) {
      // Check if account already exists
      const existing = await User.findOne({ email: account.email });
      
      if (existing) {
        console.log(`⏭️  Skipped: ${account.email} (already exists)`);
        continue;
      }

      // Create new account
      const user = await User.create(account);
      console.log(`✅ Created: ${account.email} (${account.role})`);
    }

    console.log('\n🎉 Demo accounts setup complete!\n');
    console.log('📋 Login Credentials:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👨‍💼 ADMIN ACCOUNT:');
    console.log('   Email: admin@stugig.com');
    console.log('   Password: admin123');
    console.log('   Access: Full platform administration');
    
    console.log('\n👨‍💻 FREELANCER ACCOUNTS:');
    console.log('   1. Alex Developer');
    console.log('      Email: alex@demo.com');
    console.log('      Password: demo123');
    console.log('      Skills: Full-stack development');
    
    console.log('\n   2. Sarah Designer');
    console.log('      Email: sarah@demo.com');
    console.log('      Password: demo123');
    console.log('      Skills: UI/UX design');
    
    console.log('\n   3. Mike Mobile');
    console.log('      Email: mike@demo.com');
    console.log('      Password: demo123');
    console.log('      Skills: Mobile development');
    
    console.log('\n🏢 CLIENT ACCOUNTS:');
    console.log('   1. Tech Startup');
    console.log('      Email: client@demo.com');
    console.log('      Password: demo123');
    console.log('      Company: Demo Tech Inc');
    
    console.log('\n   2. Digital Agency');
    console.log('      Email: agency@demo.com');
    console.log('      Password: demo123');
    console.log('      Company: Demo Digital Agency');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Quick Start:');
    console.log('   1. Go to http://localhost:5173/login');
    console.log('   2. Use any email above with password: demo123 (or admin123 for admin)');
    console.log('   3. Test features like posting jobs, services, bidding, messaging');
    console.log('\n✨ All accounts have wallet balance for testing transactions!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo accounts:', error);
    process.exit(1);
  }
};

createDemoAccounts();

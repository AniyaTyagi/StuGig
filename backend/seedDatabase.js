require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Job = require('./models/Job');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Make sure MongoDB Atlas is accessible and .env file is configured');
    process.exit(1);
  }
};

const sampleUsers = [
  // Students/Freelancers
  {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.student@test.com',
    password: 'password123',
    role: 'student',
    bio: 'Full-stack developer specializing in MERN stack. 3+ years experience building web applications.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript'],
    university: 'Stanford University',
    hourlyRate: 45,
    rating: 4.8,
    reviewCount: 24
  },
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.designer@test.com',
    password: 'password123',
    role: 'student',
    bio: 'UI/UX Designer with a passion for creating beautiful, user-friendly interfaces.',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Research'],
    university: 'MIT',
    hourlyRate: 40,
    rating: 4.9,
    reviewCount: 31
  },
  {
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael.mobile@test.com',
    password: 'password123',
    role: 'student',
    bio: 'Mobile app developer experienced in React Native and Flutter. Built 10+ apps.',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'Redux'],
    university: 'UC Berkeley',
    hourlyRate: 50,
    rating: 4.7,
    reviewCount: 18
  },
  {
    firstName: 'Emma',
    lastName: 'Williams',
    email: 'emma.writer@test.com',
    password: 'password123',
    role: 'student',
    bio: 'Content writer and copywriter specializing in tech and business content.',
    skills: ['Content Writing', 'Copywriting', 'SEO', 'Blog Writing', 'Technical Writing'],
    university: 'Harvard University',
    hourlyRate: 35,
    rating: 4.9,
    reviewCount: 45
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.data@test.com',
    password: 'password123',
    role: 'student',
    bio: 'Data scientist and ML engineer. Experience with Python, TensorFlow, and data analysis.',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Pandas', 'SQL'],
    university: 'Carnegie Mellon',
    hourlyRate: 55,
    rating: 4.8,
    reviewCount: 22
  },
  // Recruiters/Clients
  {
    firstName: 'Tech',
    lastName: 'Startup',
    email: 'hiring@techstartup.com',
    password: 'password123',
    role: 'startup',
    companyName: 'TechVentures Inc',
    industry: 'Technology',
    teamSize: 15,
    fundingStage: 'Series A',
    bio: 'Fast-growing SaaS startup looking for talented developers and designers.'
  },
  {
    firstName: 'Digital',
    lastName: 'Agency',
    email: 'projects@digitalagency.com',
    password: 'password123',
    role: 'recruiter',
    companyName: 'Digital Solutions Agency',
    industry: 'Marketing',
    teamSize: 50,
    bio: 'Full-service digital agency seeking freelancers for client projects.'
  },
  {
    firstName: 'E-commerce',
    lastName: 'Store',
    email: 'dev@ecommerce.com',
    password: 'password123',
    role: 'startup',
    companyName: 'ShopNow E-commerce',
    industry: 'E-commerce',
    teamSize: 8,
    fundingStage: 'Seed',
    bio: 'Online marketplace looking for developers to enhance platform features.'
  }
];

const sampleServices = [
  {
    title: 'Full-Stack Web Application Development',
    description: 'I will build a complete web application using React, Node.js, and MongoDB. Includes responsive design, user authentication, database integration, and deployment.',
    category: 'Web Development',
    price: 1200,
    deliveryTime: 14,
    tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack', 'API'],
    features: [
      'Responsive design for all devices',
      'User authentication and authorization',
      'RESTful API development',
      'Database design and integration',
      'Deployment and hosting setup',
      '2 weeks of support after delivery'
    ]
  },
  {
    title: 'Modern UI/UX Design for Web & Mobile',
    description: 'Professional UI/UX design services including wireframes, mockups, and interactive prototypes. User-centered design approach with modern aesthetics.',
    category: 'Design',
    price: 800,
    deliveryTime: 10,
    tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping', 'Wireframes'],
    features: [
      'User research and personas',
      'Wireframes and user flows',
      'High-fidelity mockups',
      'Interactive prototypes',
      'Design system creation',
      'Unlimited revisions'
    ]
  },
  {
    title: 'Cross-Platform Mobile App Development',
    description: 'Build beautiful mobile apps for iOS and Android using React Native. Single codebase, native performance, and modern UI.',
    category: 'Mobile Development',
    price: 1500,
    deliveryTime: 21,
    tags: ['React Native', 'iOS', 'Android', 'Mobile App', 'Cross-Platform'],
    features: [
      'iOS and Android apps from one codebase',
      'Native performance and UI',
      'Push notifications',
      'API integration',
      'App store submission',
      '30 days of support'
    ]
  },
  {
    title: 'SEO-Optimized Blog Content Writing',
    description: 'Professional blog posts and articles optimized for SEO. Well-researched, engaging content that ranks and converts.',
    category: 'Writing',
    price: 150,
    deliveryTime: 3,
    tags: ['Content Writing', 'SEO', 'Blog', 'Articles', 'Copywriting'],
    features: [
      '1500+ words per article',
      'SEO keyword optimization',
      'Engaging and informative',
      'Plagiarism-free content',
      'Meta descriptions included',
      '2 rounds of revisions'
    ]
  },
  {
    title: 'Machine Learning Model Development',
    description: 'Custom ML models for classification, regression, or prediction tasks. Using Python, TensorFlow, and scikit-learn.',
    category: 'Data Science',
    price: 1000,
    deliveryTime: 14,
    tags: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science', 'AI'],
    features: [
      'Data preprocessing and cleaning',
      'Model training and optimization',
      'Performance evaluation',
      'Deployment-ready model',
      'Documentation included',
      'Model explanation and insights'
    ]
  }
];

const sampleJobs = [
  {
    title: 'E-commerce Website Development with Payment Integration',
    description: 'We need a full-stack developer to build an e-commerce platform with product catalog, shopping cart, checkout, and Stripe payment integration. Must be responsive and SEO-friendly.',
    category: 'Web Development',
    budget: 2500,
    jobType: 'project',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'REST API'],
    status: 'open'
  },
  {
    title: 'Mobile App UI/UX Redesign',
    description: 'Looking for a talented designer to redesign our existing mobile app UI. Need modern, clean design with better user experience. Must provide Figma files with complete design system.',
    category: 'Design',
    budget: 1200,
    jobType: 'project',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
    skills: ['UI Design', 'UX Design', 'Figma', 'Mobile Design', 'Prototyping'],
    status: 'open'
  },
  {
    title: 'React Native Developer for Social Media App',
    description: 'Building a social media app and need an experienced React Native developer. Features include user profiles, posts, comments, likes, and real-time messaging.',
    category: 'Mobile Development',
    budget: 3500,
    jobType: 'project',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    skills: ['React Native', 'Firebase', 'Redux', 'Socket.io', 'Mobile Development'],
    status: 'open'
  },
  {
    title: 'Technical Blog Content Writer - Monthly Contract',
    description: 'Seeking a technical content writer for ongoing blog posts about web development, AI, and cloud computing. Need 8 articles per month, 2000+ words each.',
    category: 'Writing',
    budget: 1600,
    jobType: 'internship',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    skills: ['Technical Writing', 'SEO', 'Content Strategy', 'Web Development', 'AI'],
    status: 'open'
  },
  {
    title: 'Data Analysis & Visualization Dashboard',
    description: 'Need a data scientist to analyze sales data and create interactive dashboards. Should include predictive analytics and recommendations.',
    category: 'Data Science',
    budget: 2000,
    jobType: 'project',
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days
    skills: ['Python', 'Data Analysis', 'Pandas', 'Tableau', 'Machine Learning', 'SQL'],
    status: 'open'
  },
  {
    title: 'Landing Page Design & Development',
    description: 'Create a high-converting landing page for our SaaS product. Need both design and development. Must be responsive and optimized for conversions.',
    category: 'Web Development',
    budget: 800,
    jobType: 'project',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    skills: ['HTML', 'CSS', 'JavaScript', 'Figma', 'Landing Page', 'Conversion Optimization'],
    status: 'open'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Job.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get freelancers and clients
    const freelancers = createdUsers.filter(u => u.role === 'student');
    const clients = createdUsers.filter(u => u.role === 'startup' || u.role === 'recruiter');

    // Create services (assign to freelancers)
    console.log('🛠️  Creating services...');
    const servicesWithFreelancers = sampleServices.map((service, index) => ({
      ...service,
      freelancer: freelancers[index % freelancers.length]._id
    }));
    const createdServices = await Service.create(servicesWithFreelancers);
    console.log(`✅ Created ${createdServices.length} services`);

    // Create jobs (assign to clients)
    console.log('💼 Creating jobs...');
    const jobsWithClients = sampleJobs.map((job, index) => ({
      ...job,
      client: clients[index % clients.length]._id
    }));
    const createdJobs = await Job.create(jobsWithClients);
    console.log(`✅ Created ${createdJobs.length} jobs`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Services: ${createdServices.length}`);
    console.log(`   - Jobs: ${createdJobs.length}`);
    console.log('\n🔐 Test Accounts:');
    console.log('   Student: alex.student@test.com / password123');
    console.log('   Designer: sarah.designer@test.com / password123');
    console.log('   Client: hiring@techstartup.com / password123');
    console.log('\n✨ You can now use the application with sample data!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

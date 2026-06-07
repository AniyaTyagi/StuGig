require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS fallback

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Service = require('../models/Service');
const Job = require('../models/Job');
const Bid = require('../models/Bid');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Isabella', 'James',
  'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Mia', 'Mason', 'Harper', 'Ethan', 'Evelyn', 'Alexander',
  'Abigail', 'Henry', 'Emily', 'Jacob', 'Elizabeth', 'Michael', 'Sofia', 'Daniel', 'Avery', 'Logan',
  'Ella', 'Jackson', 'Madison', 'Sebastian', 'Scarlett', 'Jack', 'Victoria', 'Aiden', 'Aria', 'Owen',
  'Grace', 'Samuel', 'Chloe', 'Matthew', 'Camila', 'Joseph', 'Penelope', 'Levi', 'Riley', 'Mateo'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const universities = [
  'New York University', 'Columbia University', 'Harvard University', 'Stanford University', 'MIT',
  'UC Berkeley', 'UCLA', 'University of Pennsylvania', 'Yale University', 'Princeton University',
  'Cornell University', 'Carnegie Mellon University', 'University of Michigan', 'University of Chicago', 'UT Austin'
];

const startupNames = [
  'TechFlow', 'InnovateLabs', 'FinSphere', 'HealthGrid', 'CloudForge', 'EduLearn', 'GreenPulse', 'BrightMedia',
  'SmartRetail', 'ApexAI', 'ByteSize', 'QuantumSoft', 'Lumina', 'Zenith', 'Vortex', 'Synapse',
  'Aether', 'Hyperion', 'Helix', 'Nova', 'Pulse', 'Catalyst', 'Apex', 'Vector', 'Spectra'
];

const industries = [
  'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'CleanTech', 'Artificial Intelligence',
  'Cybersecurity', 'Web3', 'AdTech', 'Logistics', 'BioTech'
];

const categoryData = {
  'Web Development': {
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML/CSS', 'TypeScript', 'Next.js', 'TailwindCSS', 'REST APIs', 'GraphQL', 'Redux'],
    bios: [
      'CS student focusing on full-stack web development. Experienced with React and Node.',
      'Passionate web developer building high-quality MERN apps.',
      'Frontend engineer specializing in Tailwind and UI animation.',
      'Full stack enthusiast. Love writing clean, testable JavaScript.'
    ],
    serviceTitles: [
      'I will build a modern responsive React Website',
      'I will build full-stack MERN applications',
      'I will debug and optimize your Node.js backend',
      'I will create custom UI components using TailwindCSS',
      'I will integrate Stripe payments into your React app',
      'I will convert Figma designs to React and CSS',
      'I will setup serverless API endpoints using Next.js'
    ],
    jobTitles: [
      'Build landing page for student event booking app',
      'Develop menu design and website for Greenwich Cafe',
      'Build simple portfolio site for startup accelerator',
      'Fix responsive navigation bugs on student union site',
      'MERN stack developer needed to build dashboard prototype',
      'Setup authentication flow and MongoDB connection for startup',
      'Create custom API endpoints for student discount finder'
    ],
    jobDescriptions: [
      'We are launching a new startup for student event bookings and need a responsive React landing page to collect beta emails. The landing page should look clean and modern with subtle animations. Must connect to a Mailchimp form and have a features overview section. Code needs to be well-structured.',
      'We need a student developer to build a simple, clean, 3-page website (Home, Menu, Contact) for our local coffee shop "Brew & Bites" located near NYU campus. Additionally, we need a digital PDF menu designed that we can print out. Open to platforms like WordPress, Wix, or custom React.',
      'Need a clean static HTML/JS portfolio site to showcase our incubated teams. Simple design, mobile friendly, with a grid of cards showing student startup details.',
      'Mobile burger menu is broken on iOS Safari. Need quick fix for our student newspaper website.',
      'We need a developer to build an interactive dashboard UI for tracking startup analytics. Should display charts, search bars, and statistics.',
      'Require help setting up JWT authentication on an Express backend and linking it to Mongoose. Standard token and refresh token rotation needed.',
      'Need an API built to query student discount offerings based on zip code. Data is stored in MongoDB, just need the route logic and controller functions.'
    ]
  },
  'Mobile Development': {
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Dart', 'Mobile Design', 'Firebase'],
    bios: [
      'Mobile dev student building cross-platform apps.',
      'Experienced Flutter developer. Creating smooth animations and responsive mobile layouts.',
      'iOS enthusiast coding in Swift. Focus on performance and clean UX.',
      'Android developer specializing in Kotlin and Jetpack Compose.'
    ],
    serviceTitles: [
      'I will build a cross-platform mobile app using React Native',
      'I will create a beautiful Flutter app for iOS and Android',
      'I will develop a native iOS app in Swift',
      'I will design and code your mobile app MVP',
      'I will integrate push notifications and Firebase in your app',
      'I will fix bugs and UI issues in your React Native app'
    ],
    jobTitles: [
      'React Native developer for university social app',
      'Flutter dev to build fitness tracking prototype',
      'Build native iOS app for local laundry delivery service',
      'Mobile developer to implement push notifications',
      'Create simple food delivery app mockups and MVP'
    ],
    jobDescriptions: [
      'Looking for a student who can help build a social matching app for university students. Must have React Native experience. Tasks include setting up navigation, basic profile pages, and Firebase database.',
      'We are seeking a Flutter developer to build a mobile app prototype that displays user workouts. We already have the Figma design, we just need it coded with state management (Riverpod/Provider preferred).',
      'Need a simple iOS application coded in Swift to let customers schedule laundry pickups. Simple forms and Map view integration.',
      'Our current React Native app needs push notifications set up through Firebase Cloud Messaging (FCM). Both iOS and Android configurations required.',
      'Need a basic food delivery app coded using Flutter. Just mock data needed for now. Focus on responsive, modern UI design.'
    ]
  },
  'Design': {
    skills: ['Figma', 'Photoshop', 'Illustrator', 'Graphic Design', 'UI/UX', 'Logo Design', 'Branding', 'Vector Illustration', 'InDesign'],
    bios: [
      'Design major building beautiful brand identities and Figma prototypes.',
      'Creative graphic designer. Logo, poster, and digital art specialist.',
      'UI/UX designer focusing on clean, user-centric interfaces and user research.',
      'Visual designer helping startups stand out with custom branding packages.'
    ],
    serviceTitles: [
      'I will design a unique modern Logo for your startup',
      'I will create professional UI/UX designs in Figma',
      'I will design posters and banners for campus events',
      'I will build a comprehensive brand identity package',
      'I will design interactive wireframes and prototypes',
      'I will create custom illustrations and social media posts'
    ],
    jobTitles: [
      'Design poster templates for student union elections',
      'Design pitch deck and logo for pre-seed startup',
      'Figma designer needed to create SaaS web application UI',
      'Create visual identity and branding guidelines',
      'Design a modern restaurant menu and storefront flyer'
    ],
    jobDescriptions: [
      'Need a creative graphic designer to design a set of election poster templates for student candidates. The templates should be customizable in Canva or Photoshop. We need layouts for Instagram stories, feed posts, and physical 11x17 posters. Needs to look professional, youthful, and clean.',
      'We are pitching to investors next month and need a beautiful 10-slide pitch deck designed in Figma or PowerPoint. We also need a modern minimalist logo.',
      'Looking for a UI/UX designer to draft a SaaS dashboard layout. We have user stories and workflow requirements. Need wireframes, high-fidelity mockups, and component design.',
      'Startup needs custom branding guidelines: color palette, typography selection, logo usage rules, and social media post templates.',
      'Need eye-catching graphic design for a new student cafe menu card and poster flyers.'
    ]
  },
  'Writing': {
    skills: ['Copywriting', 'SEO Writing', 'Content Writing', 'Blog Writing', 'Proofreading', 'Technical Writing', 'Creative Writing', 'Editing'],
    bios: [
      'English Lit student providing high-quality copywriting and blog posts.',
      'SEO content writer. I help brands rank higher on Google search results.',
      'Technical writer translating complex concepts into clean, clear manuals.',
      'Creative writer and proofreader. Let me help you tell your brand story.'
    ],
    serviceTitles: [
      'I will write high-ranking SEO blogs and articles',
      'I will draft copy for your landing page',
      'I will proofread and edit your academic papers or blogs',
      'I will write technical documentation and API guides',
      'I will create engaging newsletter copy for your brand',
      'I will write persuasive product descriptions for Shopify'
    ],
    jobTitles: [
      'Write SEO copy for blog posts introducing new startup batches',
      'Copywriter needed for tech startup landing page',
      'Proofreader for graduate school applications',
      'Technical writer to document REST API endpoints',
      'Write content for campus club weekly newsletters'
    ],
    jobDescriptions: [
      'Need a well-researched article describing our new incubated teams. The article should be engaging, informative, and optimized for search engines.',
      'We are launching a new marketing SaaS and need punchy, high-converting copy for our landing page. Headline, subheadings, feature callouts, and call-to-action copy.',
      'Need an experienced writer to review and polish three statements of purpose for PhD applications. Looking for corrections on grammar, style, and flow.',
      'Looking for a student developer/writer to write comprehensive markdown guides for our API. Must explain headers, endpoints, request bodies, and response formats.',
      'We need weekly newsletter copy to keep members of our student entrepreneurship society updated about upcoming speaker events and workshops.'
    ]
  },
  'Marketing': {
    skills: ['Social Media Marketing', 'Google Ads', 'SEO', 'Email Marketing', 'Content Strategy', 'Canva', 'Instagram Growth', 'TikTok Marketing', 'Analytics'],
    bios: [
      'Marketing major helping local brands grow their social media presence.',
      'Digital marketer specializing in running targeted search and social ad campaigns.',
      'Instagram and TikTok content strategist. I design posts that convert.',
      'Growth marketer with focus on organic search optimization and email copy.'
    ],
    serviceTitles: [
      'I will manage your Instagram and TikTok growth',
      'I will set up and manage your Google Ad campaigns',
      'I will perform a complete SEO audit for your site',
      'I will create a social media content calendar with Canva',
      'I will set up your email marketing funnel and automation',
      'I will run targeted Facebook and Instagram ad campaigns'
    ],
    jobTitles: [
      'Social media marketer for student entrepreneurship club',
      'Google Ads setup and optimization for local gym',
      'SEO audit and keyword research for student marketplace',
      'TikTok content creator and editor for fashion startup',
      'Setup email marketing automation sequence in Mailchimp'
    ],
    jobDescriptions: [
      'Struggling to grow our student society social pages. Need a student marketer to design posts in Canva, write captions, and plan a weekly scheduling calendar.',
      'We are looking for a marketing student to set up search campaigns on Google Ads to target local customers near our new fitness gym. Budget is $500/mo.',
      'Analyze our current website structure, find crawling issues, and generate a list of high-value SEO keywords we should target in our blogs.',
      'We need a creative student who can script, shoot, and edit 10 TikTok videos showing behind-the-scenes startup life and product features.',
      'Need to build an automated email onboarding sequence of 5 emails to send to new student registrants on our platform.'
    ]
  }
};

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB Atlas');

    console.log('Cleaning database...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Job.deleteMany({});
    await Bid.deleteMany({});
    await Review.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Database cleaned');

    console.log('Hashing default password for performance...');
    const hashedPassword = await bcrypt.hash('password123', 10); // Lower rounds for fast seeding
    console.log('✅ Password pre-hashed');

    console.log('Creating Admin accounts...');
    const adminData = [
      {
        firstName: 'Admin',
        lastName: 'StuGig',
        email: 'admin@stugig.com',
        password: hashedPassword,
        role: 'admin',
        location: 'New York, USA',
        university: 'NYU',
        balance: 1000,
        isVerified: true,
        isEmailVerified: true
      },
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@stugig.com',
        password: hashedPassword,
        role: 'admin',
        location: 'San Francisco, CA',
        university: 'Stanford',
        balance: 5000,
        isVerified: true,
        isEmailVerified: true
      }
    ];
    const admins = await User.insertMany(adminData);
    console.log(`✅ Created ${admins.length} Admins`);

    console.log('Generating 150 Students...');
    const studentsData = [];
    const categories = Object.keys(categoryData);

    for (let i = 1; i <= 150; i++) {
      const fName = randomElement(firstNames);
      const lName = randomElement(lastNames);
      const email = `student${i}@stugig.com`;
      const univ = randomElement(universities);
      const cat = randomElement(categories);
      const data = categoryData[cat];
      
      const skillsCount = randomRange(3, 6);
      const userSkills = randomElements(data.skills, skillsCount);
      const bio = randomElement(data.bios);
      const hourlyRate = randomRange(15, 45);
      const rating = randomRange(40, 50) / 10.0; // 4.0 - 5.0
      const reviewCount = randomRange(1, 10);
      const earnings = reviewCount * randomRange(50, 250);
      const balance = randomRange(10, 1000);

      // Create experience
      const expCount = randomRange(1, 2);
      const experience = [];
      for (let j = 0; j < expCount; j++) {
        experience.push({
          title: randomElement(['Junior Developer', 'Design Intern', 'Marketing Assistant', 'Content Intern', 'Freelancer']),
          company: randomElement(startupNames) + ' ' + randomElement(['Inc', 'Labs', 'Co']),
          duration: '3 Months',
          description: 'Worked on building UI components, writing copies, and coordinating social media content.'
        });
      }

      studentsData.push({
        firstName: fName,
        lastName: lName,
        email,
        password: hashedPassword,
        role: 'student',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${lName}`,
        bio,
        skills: userSkills,
        hourlyRate,
        location: `${randomElement(['New York', 'Boston', 'Austin', 'San Francisco', 'Seattle', 'Chicago'])}, USA`,
        university: univ,
        portfolio: [
          { title: 'Project Alpha', url: 'https://github.com', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8' },
          { title: 'Portfolio Site', url: 'https://myportfolio.com', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' }
        ],
        rating,
        reviewCount,
        earnings,
        balance,
        isVerified: true,
        isEmailVerified: true,
        experience,
        resume: 'https://stugig-resumes.s3.amazonaws.com/mock-resume.pdf'
      });
    }

    const students = await User.insertMany(studentsData);
    console.log(`✅ Created ${students.length} Students`);

    console.log('Generating 80 Startups & Recruiters...');
    const startupsData = [];
    const clientRoles = ['startup', 'recruiter'];

    for (let i = 1; i <= 80; i++) {
      const fName = randomElement(firstNames);
      const lName = randomElement(lastNames);
      const email = `client${i}@stugig.com`;
      const clientRole = randomElement(clientRoles);
      const companyName = randomElement(startupNames) + ' ' + randomElement(['Technologies', 'Co', 'Software', 'Capital']);
      const industry = randomElement(industries);
      const teamSize = randomRange(5, 50);
      const fundingStage = randomElement(['Pre-seed', 'Seed', 'Series A', 'Series B', 'Bootstrapped']);
      const spending = randomRange(500, 10000);
      const balance = randomRange(500, 20000);

      startupsData.push({
        firstName: fName,
        lastName: lName,
        email,
        password: hashedPassword,
        role: clientRole,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${companyName}`,
        bio: `Looking for top-tier student talents to support our rapid growth. Specialized in ${industry}.`,
        location: `${randomElement(['San Francisco', 'New York', 'Austin', 'Los Angeles', 'Seattle', 'Boston'])}, CA`,
        spending,
        balance,
        isVerified: true,
        isEmailVerified: true,
        companyName,
        companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${companyName}`,
        industry,
        teamSize,
        fundingStage,
        hiringStatus: 'hiring'
      });
    }

    const clients = await User.insertMany(startupsData);
    console.log(`✅ Created ${clients.length} Startups & Recruiters`);

    console.log('Generating 120 Services (Gigs Offered by Students)...');
    const servicesData = [];
    // We select 120 random students to list services
    const writingStudents = students.filter(s => s.skills.some(skill => categoryData['Writing'].skills.includes(skill)));
    const webStudents = students.filter(s => s.skills.some(skill => categoryData['Web Development'].skills.includes(skill)));
    const designStudents = students.filter(s => s.skills.some(skill => categoryData['Design'].skills.includes(skill)));
    const mobileStudents = students.filter(s => s.skills.some(skill => categoryData['Mobile Development'].skills.includes(skill)));
    const marketingStudents = students.filter(s => s.skills.some(skill => categoryData['Marketing'].skills.includes(skill)));

    const getStudentsForCategory = (cat) => {
      switch (cat) {
        case 'Web Development': return webStudents.length ? webStudents : students;
        case 'Mobile Development': return mobileStudents.length ? mobileStudents : students;
        case 'Design': return designStudents.length ? designStudents : students;
        case 'Writing': return writingStudents.length ? writingStudents : students;
        case 'Marketing': return marketingStudents.length ? marketingStudents : students;
        default: return students;
      }
    };

    for (let i = 1; i <= 120; i++) {
      const cat = randomElement(categories);
      const data = categoryData[cat];
      const categoryStudents = getStudentsForCategory(cat);
      const student = randomElement(categoryStudents);
      const title = randomElement(data.serviceTitles) + ` (Gig #${i})`;
      const price = randomRange(30, 350);
      const deliveryTime = randomRange(2, 14);
      const tags = randomElements(data.skills, 3);
      const features = [
        'Responsive Design',
        'Custom Source Code',
        'Documentation Included',
        '1 Revision Included'
      ];

      servicesData.push({
        freelancer: student._id,
        title,
        description: `Are you a fast-growing startup looking for support? ${student.bio} I will deliver high-quality, bug-free results matching your specifications. Under budget and with rapid communication.`,
        category: cat,
        price,
        deliveryTime,
        images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97'],
        tags,
        features,
        requirements: 'Please supply a detailed brief, assets, and examples of sites or designs you like.',
        rating: student.rating,
        reviewCount: student.reviewCount,
        ordersCompleted: student.reviewCount,
        isActive: true
      });
    }

    const services = await Service.insertMany(servicesData);
    console.log(`✅ Created ${services.length} Services`);

    console.log('Generating 150 Project Gigs and 50 Internships (Jobs)...');
    const jobsData = [];
    
    // We generate 200 jobs total
    for (let i = 1; i <= 200; i++) {
      const isInternship = i > 150; // Last 50 are internships
      const cat = randomElement(categories);
      const data = categoryData[cat];
      const client = randomElement(clients);
      
      const title = randomElement(data.jobTitles) + ` (#${i})`;
      const description = randomElement(data.jobDescriptions);
      const budget = isInternship ? randomRange(1000, 4000) : randomRange(50, 800); // Internships have higher budget (monthly stipend)
      const jobType = isInternship ? 'internship' : 'project';
      
      const skillsCount = randomRange(3, 5);
      const jobSkills = randomElements(data.skills, skillsCount);

      // Distribute statuses: open, completed, in_progress, awarded, cancelled
      let status = 'open';
      if (i <= 80) status = 'completed';
      else if (i <= 130) status = 'in_progress';
      else if (i <= 165) status = 'awarded';
      else if (i <= 180) status = 'cancelled';

      jobsData.push({
        client: client._id,
        title,
        description,
        category: cat,
        budget,
        jobType,
        deadline: new Date(Date.now() + randomRange(3, 30) * 24 * 60 * 60 * 1000),
        skills: jobSkills,
        status,
        bidsCount: 0,
        isDeleted: false
      });
    }

    const jobs = await Job.insertMany(jobsData);
    console.log(`✅ Created ${jobs.length} Jobs`);

    console.log('Generating Bids, Payments, and Reviews...');
    const bidsData = [];
    const paymentsData = [];
    const reviewsData = [];
    const notificationsData = [];

    // Let's process the jobs to set their correct relationships
    for (let job of jobs) {
      const cat = job.category;
      const matchingStudents = getStudentsForCategory(cat);
      
      // Generate some bids
      const bidCount = Math.min(randomRange(2, 5), matchingStudents.length);
      const selectedStudents = randomElements(matchingStudents, bidCount);
      const jobBids = [];
      
      for (let k = 0; k < bidCount; k++) {
        const student = selectedStudents[k];
        const amount = Math.round(job.budget * (randomRange(80, 120) / 100)); // Around budget
        const deliveryTime = randomRange(2, 10);
        
        let bidStatus = 'pending';
        if (job.status === 'completed' || job.status === 'in_progress' || job.status === 'awarded') {
          bidStatus = k === 0 ? 'accepted' : 'rejected';
        }

        jobBids.push({
          job: job._id,
          freelancer: student._id,
          amount,
          deliveryTime,
          proposal: `Hi! I noticed you are seeking a student to assist with "${job.title}". As an experienced student from ${student.university} majoring in computer science/design, I have the exact skill sets you need (${job.skills.join(', ')}). I have previously completed projects in this area and would love to deliver high-quality code.`,
          status: bidStatus
        });
      }

      // Add to bidsData list
      const savedBids = await Bid.insertMany(jobBids);
      bidsData.push(...savedBids);

      // Increment bidsCount
      job.bidsCount = bidCount;

      // Map accepted bid and freelancer
      if (job.status === 'completed' || job.status === 'in_progress' || job.status === 'awarded') {
        const acceptedBid = savedBids.find(b => b.status === 'accepted');
        if (acceptedBid) {
          job.acceptedBid = acceptedBid._id;
          job.assignedFreelancer = acceptedBid.freelancer;

          // Generate Payments for in_progress / completed jobs
          const freelancerAmount = Math.round(acceptedBid.amount * 0.85); // 15% platform fee
          const platformFee = acceptedBid.amount - freelancerAmount;
          
          let payStatus = 'held';
          if (job.status === 'completed') payStatus = 'released';

          const payment = new Payment({
            job: job._id,
            payer: job.client,
            payee: acceptedBid.freelancer,
            amount: acceptedBid.amount,
            platformFee,
            freelancerAmount,
            paymentMethod: 'wallet',
            transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
            status: payStatus,
            releasedAt: job.status === 'completed' ? new Date() : undefined
          });

          await payment.save();
          job.payment = payment._id;

          // Generate Review for completed jobs
          if (job.status === 'completed') {
            const rating = randomRange(4, 5);
            const comments = [
              'Outstanding work! Delivered ahead of schedule with great attention to detail.',
              'Great communication and solid code. Will definitely work together again.',
              'Excellent design quality, followed all startup branding guidelines perfectly.',
              'Very cooperative student. Handled reviews and feedback constructively.'
            ];
            
            const review = new Review({
              job: job._id,
              reviewer: job.client,
              reviewee: acceptedBid.freelancer,
              rating,
              comment: randomElement(comments)
            });
            await review.save();
          }

          // Create Notifications
          notificationsData.push(
            {
              user: acceptedBid.freelancer,
              type: 'bid_accepted',
              title: 'Proposal Accepted',
              message: `Your bid on "${job.title}" has been accepted! You can now start working.`,
              isRead: false
            },
            {
              user: job.client,
              type: 'bid_received',
              title: 'Project Started',
              message: `Student developer has begun working on "${job.title}".`,
              isRead: false
            }
          );
        }
      }

      await job.save();
    }

    console.log(`✅ Created ${bidsData.length} Bids`);
    console.log(`✅ Processed Payments and Reviews for active/completed jobs.`);

    console.log('Generating Notifications...');
    // Add additional random notifications
    for (let i = 0; i < 50; i++) {
      const student = randomElement(students);
      notificationsData.push({
        user: student._id,
        type: 'message',
        title: 'New Message Received',
        message: 'Hey, are you available for a quick chat regarding a contract gig?',
        isRead: Math.random() > 0.5
      });
    }
    
    await Notification.insertMany(notificationsData);
    console.log(`✅ Generated ${notificationsData.length} Notifications`);

    console.log('🎉 Database seeding completed successfully with 400+ entries!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();

StuGig Technical Documentation (MVP)
Version: 1.0
Architecture: MERN + Razorpay + Socket.io

System Architecture
•	Frontend: React + Vite + TailwindCSS
•	Backend: Node.js + Express.js
•	Database: MongoDB Atlas
•	Authentication: JWT + bcrypt
•	Payments: Razorpay Escrow Flow
•	Realtime Messaging: Socket.io

Core Modules
•	Authentication & Authorization
•	User Profiles
•	Job Marketplace
•	Bidding System
•	Messaging System
•	Payment & Escrow
•	Reviews & Ratings
•	Admin Dashboard

Database Collections
•	Users
•	Jobs
•	Bids
•	Payments
•	Conversations
•	Messages
•	Reviews
•	Notifications

API Structure
•	/api/v1/auth
•	/api/v1/users
•	/api/v1/jobs
•	/api/v1/bids
•	/api/v1/payments
•	/api/v1/messages
•	/api/v1/admin

Security
•	JWT Authentication
•	bcrypt Password Hashing
•	Rate Limiting
•	Input Validation
•	HTTPS Enforcement
•	Role-Based Access Control

Deployment
•	Frontend: Vercel
•	Backend: Render/AWS
•	Database: MongoDB Atlas
• Payment Gateway: Razorpay
•	CI/CD: GitHub Actions

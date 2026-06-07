# 🎓 StuGig

### AI-Powered Freelance Marketplace for Students

StuGig is a full-stack freelance marketplace built exclusively for university students. It enables students to showcase skills, bid on projects, communicate with clients in real time, and receive secure payments through an escrow-based workflow.

Built using the MERN stack with AI-powered job recommendations, real-time messaging, and secure payment infrastructure.

---

![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Overview

Traditional freelance platforms are often crowded with experienced professionals, making it difficult for students to secure opportunities.

StuGig solves this problem by providing a dedicated ecosystem where students can:

* Find freelance opportunities
* Build professional portfolios
* Earn while studying
* Gain real-world experience
* Connect directly with startups and businesses

The platform combines modern web technologies with AI-driven matching to improve project discovery and hiring efficiency.

---

## ✨ Features

### 👨‍🎓 Student Features

* Create professional profiles
* Add skills and portfolios
* Browse available projects
* Submit bids and proposals
* Receive AI-powered recommendations
* Track earnings and project history
* Real-time chat with clients
* Review and rating system

### 💼 Client Features

* Post projects
* Receive proposals
* Compare candidates
* Hire freelancers
* Escrow payment protection
* Project management dashboard
* Communication tools
* Freelancer recommendations

### 🛡️ Admin Features

* User management
* Job moderation
* Platform analytics
* Payment monitoring
* Report management
* System controls

---

## 🤖 AI-Powered Matching

StuGig includes an intelligent recommendation engine that ranks opportunities using multiple compatibility factors:

| Factor               | Weight |
| -------------------- | ------ |
| Skill Match          | 30%    |
| Experience Level     | 20%    |
| User Ratings         | 15%    |
| Budget Compatibility | 10%    |
| Success History      | 10%    |
| Category Expertise   | 8%     |
| Availability         | 5%     |
| Behavior Score       | 2%     |

The system generates personalized job recommendations and improves discovery for both freelancers and clients.

---

## 💳 Escrow Payment System

Secure project payments are handled through Razorpay.

Workflow:

Client Funds Project
↓
Payment Held in Escrow
↓
Student Completes Work
↓
Client Approval
↓
Funds Released
↓
Platform Commission Deducted

Benefits:

* Protection for clients
* Guaranteed payments for freelancers
* Transparent transaction tracking
* Dispute-friendly workflow

---

## 💬 Real-Time Communication

Powered by Socket.io:

* Instant messaging
* Online/offline presence
* Typing indicators
* Notification system
* Message history
* Read status tracking

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
        │
        ▼
REST API + WebSocket
        │
        ▼
Backend (Node.js + Express)
        │
 ┌──────┼───────────┐
 │      │           │
 ▼      ▼           ▼
MongoDB Socket.io Razorpay
 Atlas  Realtime Payments
```

---

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Redux Toolkit
* React Router
* TailwindCSS
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Socket.io
* Razorpay

### Security

* Helmet
* bcrypt
* Rate Limiting
* Input Validation
* CORS Protection
* Secure Cookies

---

## 📂 Project Structure

```text
StuGig
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── middlewares
│   ├── socket
│   └── utils
│
├── frontend
│   ├── components
│   ├── pages
│   ├── redux
│   ├── hooks
│   ├── services
│   └── utils
│
├── docs
│   ├── PRD.md
│   ├── TECHNICAL_SPEC.md
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPER_GUIDE.md
│
└── README.md
```

---

## ⚡ Quick Start

### Clone Repository

```bash
git clone https://github.com/yourusername/stugig.git
cd stugig
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Run:

```bash
npm run dev
```

---

## 📖 Documentation

| Document             | Description           |
| -------------------- | --------------------- |
| PRD.md               | Product Requirements  |
| TECHNICAL_SPEC.md    | System Architecture   |
| API_DOCUMENTATION.md | API Reference         |
| DEPLOYMENT.md        | Production Deployment |
| DEVELOPER_GUIDE.md   | Onboarding Guide      |
| CHANGELOG.md         | Version History       |

---

## 🔐 Security Highlights

* JWT Authentication
* Refresh Token Strategy
* Role-Based Access Control
* Password Hashing
* Input Sanitization
* Rate Limiting
* XSS Protection
* Secure Payment Verification

---

## 📈 Future Roadmap

### Phase 2

* Mobile Application
* Email Notifications
* Video Interview Calls
* Milestone Payments

### Phase 3

* AI Fraud Detection
* Skill Verification Tests
* Multi-language Support
* University Partnerships

---

## 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Create a Pull Request for review.

---

## 📄 License

Licensed under the MIT License.

---

## 👨‍💻 Built For Learning & Growth

StuGig was created to bridge the gap between talented students and real-world opportunities, helping the next generation gain experience, build portfolios, and earn income while studying.

⭐ If you found this project interesting, consider starring the repository.

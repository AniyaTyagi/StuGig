# 👨‍💻 StuGig Developer Guide

## Overview

Welcome to StuGig.

This guide helps developers set up the project, understand the architecture, follow development standards, and contribute effectively.

---

# Prerequisites

Before starting, install:

* Node.js 18+
* npm 9+
* Git
* MongoDB Atlas Account
* Razorpay Developer Account
* VS Code (Recommended)

Recommended Extensions:

* ESLint
* Prettier
* GitLens
* MongoDB for VS Code
* REST Client

---

# Project Setup

## Clone Repository

```bash
git clone <repository-url>
cd stugig
```

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# Environment Configuration

## Backend (.env)

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=<mongodb_connection_string>

JWT_SECRET=<jwt_secret>
JWT_REFRESH_SECRET=<jwt_refresh_secret>

RAZORPAY_KEY_ID=<razorpay_key>
RAZORPAY_KEY_SECRET=<razorpay_secret>

CLIENT_URL=http://localhost:5173

PLATFORM_COMMISSION=15
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

# Running Locally

## Backend

```bash
cd backend
npm run dev
```

Runs on:

```text
http://localhost:5000
```

## Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

# Project Structure

```text
stugig/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│
└── docs/
```

---

# Architecture

## Frontend

* React 18
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Socket.io

## Third-Party Services

* Razorpay
* Cloudinary
* MongoDB Atlas

---

# Development Workflow

## Branch Naming

```text
feature/user-profile
feature/job-search

fix/payment-bug
fix/login-error

docs/api-update
```

## Commit Convention

```text
feat: add bidding system
fix: resolve payment bug
docs: update API guide
refactor: optimize job service
test: add auth tests
```

---

# Coding Standards

## Frontend

* Functional Components only
* React Hooks preferred
* Redux for global state
* Tailwind for styling
* No inline styles

## Backend

* Controller → Service → Model pattern
* Input validation required
* Proper error handling
* Async/Await only

---

# API Development

Every endpoint should include:

* Authentication
* Validation
* Error handling
* Consistent response format

Example:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# Testing Checklist

Before creating a pull request:

* Application builds successfully
* No ESLint errors
* No console errors
* API endpoints tested
* Authentication tested
* Payment flow tested
* Documentation updated

---

# Security Guidelines

Never:

* Commit .env files
* Commit API keys
* Commit database credentials
* Log sensitive user information

Always:

* Hash passwords
* Validate inputs
* Use HTTPS in production
* Protect private routes

---

# Deployment

## Frontend

* Vercel

## Backend

* Render / AWS

## Database

* MongoDB Atlas

---

# Documentation

Developers should maintain:

* README.md
* API Documentation
* Technical Specification
* Deployment Guide
* Changelog

---

# Support

For development issues:

1. Review project documentation
2. Search existing issues
3. Check application logs
4. Contact project maintainers

---

# Goal

Maintain a scalable, secure, and maintainable student freelancing platform that can support future growth and new features.

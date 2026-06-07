# StuGig — Project Summary

## Overview

StuGig is a student-focused freelance marketplace designed to connect university students with businesses, startups, and individuals seeking affordable digital services. The platform enables students to gain practical experience, build portfolios, and earn income while providing clients with access to skilled emerging talent.

---

## Objective

Traditional freelancing platforms often present high competition and entry barriers for students. StuGig addresses this challenge by creating a dedicated ecosystem where students can showcase their skills, bid on projects, collaborate with clients, and receive secure payments.

---

## Core Features

### User Management

* Student, Client, and Admin roles
* Secure authentication using JWT
* Profile creation and portfolio management
* Skills and experience tracking

### Job Marketplace

* Job posting and management
* Search and filtering capabilities
* Project categories and skill requirements
* Saved jobs functionality

### Bidding System

* Proposal submission
* Budget and timeline negotiation
* Bid management dashboard
* Hiring workflow

### Communication

* Real-time messaging using Socket.io
* Project discussions
* Notifications and activity updates

### Payments

* Razorpay payment integration
* Escrow-based transaction flow
* Earnings and transaction history
* Platform commission management

### Reviews & Ratings

* Mutual client-freelancer reviews
* Reputation scoring
* Project completion feedback

---

## Technical Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MongoDB Atlas
* Mongoose ODM

### Third-Party Services

* Razorpay (Payments)
* Cloudinary (File Storage)
* Socket.io (Real-Time Communication)

---

## System Architecture

Client (React) → REST API (Express) → MongoDB Atlas

Additional Services:

* Socket.io for real-time messaging
* Razorpay for payment processing
* Cloudinary for file uploads

---

## Database Modules

* Users
* Jobs
* Bids
* Payments
* Conversations
* Messages
* Reviews
* Notifications

---

## Security

* JWT-based authentication
* bcrypt password hashing
* Role-based access control
* Input validation
* Rate limiting
* HTTPS support
* Secure payment workflows

---

## Business Model

StuGig generates revenue through a platform commission charged on successfully completed projects.

### Revenue Source

* 15% commission per completed transaction

---

## Future Enhancements

* AI-powered job recommendations
* Mobile applications
* Milestone-based payments
* Skill verification tests
* Recruiter portal
* University partnerships

---

## Project Goal

To become the preferred freelancing platform for students by providing a trusted environment where they can gain experience, develop professional skills, and earn income while studying.
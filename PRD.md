# Product Requirements Document (PRD)

## Product Name

**StuGig**

## Version

v1.0 (MVP)

## Overview

StuGig is a freelance marketplace built specifically for university students. The platform connects student freelancers with businesses, startups, and individuals seeking affordable, high-quality services while providing students with opportunities to gain experience, build portfolios, and earn income.

---

# Problem Statement

Students struggle to secure freelance opportunities due to:

* Lack of professional experience
* High competition on existing platforms
* Limited trust from clients
* Complicated onboarding processes

Clients struggle to find affordable and reliable early-career talent.

---

# Solution

StuGig provides a dedicated platform where:

* Students can showcase skills and bid on projects
* Clients can post jobs and hire verified student freelancers
* Payments are securely handled through escrow
* Both parties communicate and collaborate in one place

---

# Target Users

### Student Freelancers

* University students (18–25 years)
* Developers, designers, writers, marketers, tutors

### Clients

* Startups
* Small businesses
* Entrepreneurs
* Agencies

---

# Business Model

### Revenue

* 15% commission on every completed project

### Payment Flow

1. Client posts job
2. Student submits bid
3. Client hires freelancer
4. Client deposits payment
5. Work completed
6. Funds released to freelancer
7. StuGig retains 15% commission

---

# MVP Features

## 1. Authentication & Profiles

### Student

* Sign up/Login
* Profile creation
* Skills
* Portfolio links
* Education details

### Client

* Sign up/Login
* Company profile
* Contact information

---

## 2. Job Marketplace

### Clients

* Create jobs
* Set budget
* Define requirements
* Manage applications

### Students

* Browse jobs
* Search & filter jobs
* Save jobs
* Submit proposals

---

## 3. Bidding System

Students can:

* Submit bids
* Set proposed price
* Set delivery timeline
* Write proposal

Clients can:

* Review bids
* Compare freelancers
* Accept or reject proposals

---

## 4. Messaging

* Real-time chat
* Project discussions
* File sharing
* Notifications

---

## 5. Payments

### Razorpay Integration

* Secure checkout
* Escrow-based payments
* Transaction history
* Earnings dashboard

---

## 6. Reviews & Ratings

After project completion:

* Client rates freelancer
* Freelancer rates client
* Ratings displayed on profiles

---

# User Flow

### Student Journey

Register → Create Profile → Browse Jobs → Submit Bid → Get Hired → Complete Work → Receive Payment → Get Review

### Client Journey

Register → Post Job → Review Bids → Hire Student → Fund Project → Receive Deliverables → Release Payment → Leave Review

---

# Technical Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT

### Payments

* Razorpay

### Real-Time Communication

* Socket.io

### Hosting

* Vercel (Frontend)
* Render/AWS (Backend)

---

# Success Metrics

### First 6 Months

* 1,000+ registered users
* 300+ active freelancers
* 100+ active clients
* ₹5,00,000 GMV
* 80% project completion rate
* Average rating above 4.5/5

---

# Non-Goals (MVP)

The following will not be included in Version 1:

* Mobile apps
* Video calls
* AI job matching
* Milestone payments
* Team accounts
* Advanced analytics
* International payments

---

# Future Enhancements

* AI-powered recommendations
* Mobile applications
* Milestone-based escrow
* Skill assessments
* University partnerships
* Internship marketplace
* Recruiter hiring portal

---

# Vision

To become the leading freelance and career-launch platform for students, helping them gain real-world experience, earn income, and build professional careers before graduation.

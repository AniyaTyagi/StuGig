StuGig API Documentation
Authentication
•	POST /api/v1/auth/register
•	POST /api/v1/auth/login
•	GET /api/v1/auth/me
•	PUT /api/v1/auth/password
•	POST /api/v1/auth/refresh
Users
•	GET /api/v1/users/profile
•	PUT /api/v1/users/profile
•	GET /api/v1/users/:userId
Jobs
•	GET /api/v1/jobs
•	POST /api/v1/jobs
•	GET /api/v1/jobs/:jobId
•	PUT /api/v1/jobs/:jobId
•	DELETE /api/v1/jobs/:jobId
Bids
•	POST /api/v1/bids
•	GET /api/v1/bids/job/:jobId
•	GET /api/v1/bids/my-bids
•	PATCH /api/v1/bids/:bidId/accept
Payments
•	POST /api/v1/payments/create
•	POST /api/v1/payments/:paymentId/release
•	POST /api/v1/payments/:paymentId/refund
•	GET /api/v1/payments/balance
Messaging
•	POST /api/v1/messages
•	GET /api/v1/messages/conversations
Reviews
•	POST /api/v1/reviews
•	GET /api/v1/reviews/user/:userId
Admin
•	GET /api/v1/admin/dashboard
•	GET /api/v1/admin/users

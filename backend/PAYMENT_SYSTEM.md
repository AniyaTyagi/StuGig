# Payment System (No Stripe)

## Overview
Simple escrow-based payment system with wallet management. No external payment gateway required.

## Features
- ✅ Wallet system for all users
- ✅ Escrow payment holding
- ✅ Platform commission (15%)
- ✅ Payment release/refund
- ✅ Transaction tracking
- ✅ Balance management

## Payment Flow

```
1. Client adds funds to wallet
   ├─> POST /api/payments/add-funds { amount: 1000 }
   └─> Wallet balance increased

2. Client creates job payment (held in escrow)
   ├─> POST /api/payments/create { jobId, amount: 500 }
   ├─> Deduct 500 from client wallet
   ├─> Hold in escrow (status: 'held')
   └─> Job status: 'in_progress'

3. Freelancer completes work

4. Client releases payment
   ├─> POST /api/payments/{paymentId}/release
   ├─> Platform fee: 75 (15% of 500)
   ├─> Freelancer receives: 425 (85% of 500)
   ├─> Payment status: 'released'
   └─> Job status: 'completed'

OR

4. Client/Admin refunds payment
   ├─> POST /api/payments/{paymentId}/refund
   ├─> Full amount (500) returned to client
   ├─> Payment status: 'refunded'
   └─> Job status: 'cancelled'
```

## API Endpoints

### 1. Get Wallet Balance
```http
GET /api/payments/balance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "wallet": {
    "balance": 5000,
    "earnings": 3000,
    "spending": 2000
  }
}
```

### 2. Add Funds to Wallet
```http
POST /api/payments/add-funds
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "bank_transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "1000 added to wallet",
  "balance": 6000
}
```

### 3. Create Payment (Escrow)
```http
POST /api/payments/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobId": "6584a1b2c3d4e5f6a7b8c9d0",
  "amount": 500,
  "paymentMethod": "wallet"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment held in escrow",
  "payment": {
    "id": "6584a1b2c3d4e5f6a7b8c9d1",
    "job": "6584a1b2c3d4e5f6a7b8c9d0",
    "amount": 500,
    "platformFee": 75,
    "freelancerAmount": 425,
    "status": "held",
    "transactionId": "TXN1702345678ABC123"
  }
}
```

### 4. Release Payment
```http
POST /api/payments/{paymentId}/release
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment released to freelancer",
  "payment": {
    "status": "released",
    "releasedAt": "2024-06-15T10:30:00.000Z"
  }
}
```

### 5. Refund Payment
```http
POST /api/payments/{paymentId}/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Work not completed as agreed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment refunded to client",
  "payment": {
    "status": "refunded",
    "refundedAt": "2024-06-15T11:00:00.000Z"
  }
}
```

### 6. Get User Payments
```http
GET /api/payments/user?type=sent
GET /api/payments/user?type=received
GET /api/payments/user
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "payments": [
    {
      "id": "6584a1b2c3d4e5f6a7b8c9d1",
      "job": { "title": "Build Website" },
      "amount": 500,
      "status": "released",
      "createdAt": "2024-06-15T09:00:00.000Z"
    }
  ]
}
```

### 7. Withdraw Funds
```http
POST /api/payments/withdraw
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "withdrawMethod": "bank_transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal of 1000 initiated",
  "balance": 4000
}
```

### 8. Get Payment Details
```http
GET /api/payments/{paymentId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "6584a1b2c3d4e5f6a7b8c9d1",
    "job": { "title": "Build Website" },
    "payer": { "firstName": "John", "lastName": "Doe" },
    "payee": { "firstName": "Jane", "lastName": "Smith" },
    "amount": 500,
    "platformFee": 75,
    "freelancerAmount": 425,
    "status": "released",
    "transactionId": "TXN1702345678ABC123"
  }
}
```

## Payment Statuses

- **pending** - Payment initiated but not processed
- **held** - Payment in escrow, waiting for work completion
- **released** - Payment released to freelancer
- **refunded** - Payment refunded to client
- **failed** - Payment processing failed

## Payment Methods

- **wallet** - Use platform wallet balance
- **bank_transfer** - Bank transfer (manual verification)
- **cash** - Cash payment (manual verification)

## Database Model

```javascript
{
  job: ObjectId,           // Reference to Job
  payer: ObjectId,         // Client who pays
  payee: ObjectId,         // Freelancer who receives
  amount: Number,          // Total payment amount
  platformFee: Number,     // Platform commission (15%)
  freelancerAmount: Number, // Amount freelancer receives (85%)
  paymentMethod: String,   // wallet/bank_transfer/cash
  transactionId: String,   // Unique transaction ID
  status: String,          // pending/held/released/refunded/failed
  releasedAt: Date,
  refundedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Platform Commission

Default: **15%** (configured in .env as PLATFORM_COMMISSION)

Example:
- Job payment: $500
- Platform fee: $75 (15%)
- Freelancer receives: $425 (85%)

## Security Features

- Only payer can release payment
- Only payer or admin can refund
- Balance validation before payment
- Transaction ID for tracking
- Payment status validation

## Frontend Integration Example

```javascript
// Add funds
const addFunds = async (amount) => {
  const response = await fetch('/api/payments/add-funds', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount, paymentMethod: 'bank_transfer' })
  });
  return await response.json();
};

// Create escrow payment
const createPayment = async (jobId, amount) => {
  const response = await fetch('/api/payments/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ jobId, amount, paymentMethod: 'wallet' })
  });
  return await response.json();
};

// Release payment
const releasePayment = async (paymentId) => {
  const response = await fetch(`/api/payments/${paymentId}/release`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Get balance
const getBalance = async () => {
  const response = await fetch('/api/payments/balance', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

## Testing

```bash
# Get balance
curl -X GET http://localhost:5000/api/payments/balance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add funds
curl -X POST http://localhost:5000/api/payments/add-funds \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "paymentMethod": "bank_transfer"}'

# Create payment
curl -X POST http://localhost:5000/api/payments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "JOB_ID", "amount": 500, "paymentMethod": "wallet"}'

# Release payment
curl -X POST http://localhost:5000/api/payments/PAYMENT_ID/release \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Files Created/Updated

- `models/Payment.js` - Updated to remove Stripe fields
- `controllers/paymentController.js` - Payment logic without Stripe
- `routes/payment.routes.js` - Payment API routes
- `.env` - Removed Stripe configuration
- `.env.example` - Removed Stripe configuration

---

**Simple, secure payment system without external dependencies!** 🎉

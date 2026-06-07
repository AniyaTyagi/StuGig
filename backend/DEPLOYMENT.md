# Backend Deployment Guide

## Deploy to Render

### Prerequisites
- Render account
- GitHub repository
- MongoDB Atlas connection string
- Stripe API keys

### Step 1: Prepare Repository

1. Ensure `.env.example` exists in backend root
2. Make sure `package.json` has start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com)
2. Sign in with GitHub account
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Configure:
   - **Name**: stugig-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Node Version**: 18

### Step 3: Set Environment Variables

In Render dashboard, add:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/stugig
JWT_SECRET=your_long_secret_key_here
JWT_REFRESH_SECRET=your_long_refresh_secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=https://yourdomain.com
PLATFORM_COMMISSION=15
```

### Step 4: Configure MongoDB Atlas

1. Add Render IP to MongoDB Atlas IP whitelist
2. Create database user with strong password
3. Get connection string (include credentials)

### Step 5: Deploy

1. Click "Deploy"
2. Monitor build logs
3. Once deployed, note the URL: `https://stugig-backend.render.com`

### Step 6: Update Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://stugig-backend.render.com/api/payments/webhook`
3. Select events: payment_intent.succeeded, payment_intent.payment_failed
4. Update `STRIPE_WEBHOOK_SECRET` in Render environment

### Monitoring

- Access logs: Render Dashboard → Logs
- Health check: `https://stugig-backend.render.com/api/health`
- Check for errors in Render dashboard

## Environment Variables Reference

```bash
# Application
NODE_ENV=production                          # production|development
PORT=5000                                     # Server port

# Database
MONGODB_URI=mongodb+srv://...                 # MongoDB connection string

# Authentication
JWT_SECRET=min_32_chars_secret_key           # JWT signing key
JWT_EXPIRE=30d                               # Token expiration
JWT_REFRESH_SECRET=min_32_chars_refresh_key  # Refresh token secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...                # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_live_...           # Stripe public key
STRIPE_WEBHOOK_SECRET=whsec_...              # Webhook signing secret

# Application Settings
CLIENT_URL=https://yourdomain.com            # Frontend URL
PLATFORM_COMMISSION=15                       # Platform fee percentage

# Optional: AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=us-east-1

# Optional: Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=app_password
```

## Post-Deployment Checklist

- [ ] API health check returns 200
- [ ] MongoDB connection working
- [ ] JWT authentication working
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] File uploads working
- [ ] Socket.io connections working
- [ ] Stripe integration working
- [ ] Email notifications (if configured)
- [ ] Logging and monitoring setup
- [ ] Error handling working
- [ ] Security headers present

## Troubleshooting

### MongoDB Connection Failed
- Check connection string format
- Verify username/password
- Check IP whitelist in MongoDB Atlas
- Verify network connectivity

### Stripe Not Working
- Confirm API keys are correct
- Check webhook endpoint is accessible
- Verify webhook signing secret
- Test with Stripe test mode first

### Static Files Not Serving
- Verify `/uploads` directory exists
- Check file permissions
- Verify multer configuration

## Scaling Considerations

- Monitor database performance
- Setup caching layer (Redis)
- Consider CDN for static assets
- Implement database indexes
- Monitor API response times

---

See main README for full documentation.

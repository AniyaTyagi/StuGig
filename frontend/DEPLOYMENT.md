# Frontend Deployment Guide

## Deploy to Vercel

### Prerequisites
- Vercel account
- GitHub repository with frontend code
- Backend API URL from deployment

### Step 1: Prepare Repository

Ensure frontend is in `frontend/` directory with:
- `package.json` with build script
- `.env.example` with VITE_API_URL

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables

In Vercel project settings, add:
```
VITE_API_URL=https://stugig-backend.render.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Step 4: Deploy

1. Click "Deploy"
2. Monitor deployment logs
3. Once complete, note domain: `https://stugig.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records according to Vercel instructions

### Step 6: Update Backend CORS

In backend `.env`, update:
```
CLIENT_URL=https://yourdomain.vercel.app
```

## Build Optimization

### Vite Configuration

`vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'ui': ['axios', 'socket.io-client']
        }
      }
    }
  }
})
```

## Performance Considerations

### Code Splitting
- Use React.lazy() for route components
- Implement Suspense boundaries
- Split large Redux slices

### Image Optimization
- Use WebP format
- Implement lazy loading
- Optimize image sizes
- Use responsive images

### Bundle Analysis
```bash
npm install -g vite-plugin-visualizer
# Add to vite.config.js
import { visualizer } from "rollup-plugin-visualizer"
// Add to plugins array
```

## Monitoring & Analytics

1. **Error Tracking**: Integrate Sentry
```javascript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN"
})
```

2. **Analytics**: Add Google Analytics
3. **Performance**: Use Web Vitals

## Environment Variables

```env
VITE_API_URL=https://stugig-backend.render.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_APP_ENV=production
```

## Post-Deployment Checklist

- [ ] Frontend loads successfully
- [ ] All routes working
- [ ] API calls reaching backend
- [ ] Authentication working
- [ ] Socket.io connecting
- [ ] Real-time chat working
- [ ] Payments working
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] No console errors
- [ ] HTTPS/SSL working
- [ ] Custom domain working

## Troubleshooting

### Build Failed
- Check Node version (16+)
- Clear node_modules and reinstall
- Check for TypeScript errors
- Review build logs

### API Calls Failing
- Verify VITE_API_URL is correct
- Check CORS settings on backend
- Verify backend is running
- Check network tab for details

### Socket.io Not Connecting
- Verify backend Socket.io is running
- Check CORS configuration
- Verify WebSocket support
- Check browser console

## Continuous Deployment

Vercel automatically deploys on push to main branch.

To disable auto-deploy:
1. Go to Settings → Git
2. Uncheck "Automatically deploy"

## Rollback

If deployment breaks:
1. Go to Deployments
2. Find previous stable version
3. Click "Promote to Production"

---

See main README for full documentation.

# 🚀 Vercel Deployment Guide - CivicTrust

## ✅ Pre-Deployment Checklist

Configuration files created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `render.yaml` - Backend deployment config
- ✅ `.env.example` - Environment variables template
- ✅ `.env.production` - Frontend production settings
- ✅ Backend updated with environment variables

---

## Step-by-Step Deployment

### Phase 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select "civic-trust" or your repo name

3. **Configure Service**
   - **Name**: `civictrust-backend`
   - **Root Directory**: (leave blank)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: Free

4. **Add Environment Variables**
   ```
   SECRET_KEY = your-random-secret-key-here
   PORT = 5000
   NODE_ENV = production
   ```

   > **Generate a random SECRET_KEY** using this command:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the backend URL (e.g., `https://civictrust-backend.onrender.com`)

6. **Test Backend**
   - Visit `https://your-backend.onrender.com/`
   - You should see "Civic Trust API is running! 🚀"

---

### Phase 2: Update Configuration

1. **Update `vercel.json`**
   Replace `civictrust-backend.onrender.com` with YOUR actual Render URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://YOUR-ACTUAL-BACKEND.onrender.com/api/:path*"
       }
     ]
   }
   ```

2. **Commit Changes** (if using Git)
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push
   ```

---

### Phase 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: ./ (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL = /api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

6. **Update Backend CORS**
   - Go back to Render dashboard
   - Add environment variable:
     ```
     CORS_ORIGIN = https://your-app.vercel.app
     ```
   - Redeploy backend (it will auto-start)

---

### Phase 4: Verify Deployment

1. **Visit Your App**
   - Go to `https://your-app.vercel.app`

2. **Test Citizen Portal**
   - Sign up as a new citizen
   - Login
   - Submit a report (with image from Cloudinary)
   - Check if it appears

3. **Test Admin Portal**
   - Logout from citizen
   - Login as `admin@civictrust.com`
   - Password: your test password
   - Verify dashboard loads
   - Check hierarchical filtering

---

## 🎯 Quick Reference

### Test Accounts

| Email | Role | Level | Password |
|-------|------|-------|----------|
| `admin@civictrust.com` | Admin | L3 | (your test password) |
| `zone5@bbmp.gov.in` | Admin | L2 | (your test password) |
| `indiranagar@bbmp.gov.in` | Admin | L1 | (your test password) |

### Important URLs

- **Frontend** (Vercel): `https://your-app.vercel.app`
- **Backend** (Render): `https://your-backend.onrender.com`
- **API**: Frontend URL + `/api/...`

---

## ⚠️ Important Notes

### Data Persistence
- ✅ Using JSON file storage
- ⚠️ **Data will reset when backend restarts**
- This is fine for a demo/hackathon
- For production, migrate to MongoDB/PostgreSQL

### Free Tier Limitations

**Render Free Tier:**
- ✅ Unlimited bandwidth
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ⚠️ Data resets on each deploy

**Vercel Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ Always-on, no spin-down
- ✅ Generous limits for hobby projects

---

## 🐛 Troubleshooting

### Frontend can't connect to API
- Check if backend URL in `vercel.json` is correct
- Verify backend is running on Render
- Check browser console for CORS errors

### CORS Errors
- Ensure `CORS_ORIGIN` env var is set on Render
- Value should be your Vercel URL
- Redeploy backend after adding env var

### Backend not starting
- Check Render logs
- Verify `package.json` has all dependencies
- Ensure Node version compatibility

### Images not uploading
- Cloudinary credentials are hardcoded in `ReportIssue.jsx`
- Should work as-is
- For security, move to environment variables later

---

## 📝 Next Steps (Optional)

- [ ] Add custom domain to Vercel
- [ ] Migrate to MongoDB Atlas (free tier)
- [ ] Move Cloudinary credentials to env vars
- [ ] Set up monitoring/alerts
- [ ] Add performance analytics

---

**Ready to deploy!** Follow the steps above and your app will be live in ~20 minutes. 🚀

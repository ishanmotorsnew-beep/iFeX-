# IFEX Deployment Guide - Running on InfinityFree & Other Platforms

## Quick Start - Local Development

To run the application locally with automatic startup:

### Windows
Double-click `start.bat` in the `server/` folder

### Mac/Linux
```bash
cd server
chmod +x start.sh
./start.sh
```

Then open your browser to `http://localhost:3000`

---

## Deploying to Free Hosting Platforms

### ⚠️ Important: InfinityFree Limitation
**InfinityFree does NOT support Node.js applications.** It's designed for PHP/MySQL only.

For a Node.js application like IFEX, you need to use:

---

## ✅ Recommended: Render.com (Free Tier)

Render offers free Node.js hosting with automatic deployments.

### Steps:

1. **Sign up** at https://render.com (GitHub login recommended)

2. **Push your code to GitHub:**
   ```bash
   cd F:\ifex-fixed-smtp-hosting\ifex - Copy\IFEX
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

3. **Create a new Web Service on Render:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set these values:
     - **Name:** ifex
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

4. **Create a disk for persistent data:**
   - Add disk mount point: `/app/dist/data`
   - This persists your database between deployments

5. **Deploy** - Render will automatically build and start your app!

---

## Alternative: Railway.app (Free Trial)

### Steps:

1. Sign up at https://railway.app

2. Click "New Project" → "Deploy from GitHub"

3. Select your GitHub repository

4. Set environment variable:
   - `NODE_ENV=production`

5. Railway auto-detects Node.js and starts your app!

---

## Alternative: Replit (Free & Easy)

### Steps:

1. Go to https://replit.com

2. Click "Create" → "Import from GitHub"

3. Paste your GitHub URL

4. In `.replit` file, set:
   ```
   run = "cd dist/server && npm install && npm start"
   ```

5. Click "Run" - your app starts instantly!

---

## Alternative: Vercel (Frontend Only)

If you only want to host the **frontend** for free on Vercel:

1. Deploy the `dist/public` folder to Vercel
2. Host the backend separately on Render or Railway
3. Update API endpoints in frontend config

---

## ❌ If You MUST Use InfinityFree

You can use InfinityFree for **static files only** (frontend):

1. **On InfinityFree:**
   - Upload contents of `dist/public/` to your InfinityFree account via FTP/File Manager

2. **Backend & Database:**
   - Host API on Render/Railway (above)
   - Update frontend API URLs to point to your backend

3. **Configure API URLs:**
   - Edit `frontend/src/config/api.js` to use your backend URL:
   ```javascript
   const API_BASE = 'https://your-render-app.onrender.com/api'
   ```

---

## Environment Variables

Create a `.env` file in `dist/server/`:

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

On hosted platforms:
- **Render:** Set in "Environment" tab
- **Railway:** Set in "Variables" tab
- **Replit:** Set in "Secrets" sidebar

---

## Database Persistence

Your database is stored in `dist/data/content.json`

**On free hosting platforms:**
- **Render:** Use Persistent Disk (comes with Free tier)
- **Railway:** Use Railway's Postgres (or persistent volume)
- **Replit:** Files persist automatically

---

## Production Checklist

Before deploying:

- [ ] Database file exists: `dist/data/content.json`
- [ ] All dependencies in `dist/server/package.json`
- [ ] Frontend built: `dist/public/` has files
- [ ] Environment set to `production`
- [ ] API endpoints configured correctly
- [ ] CORS enabled for your domain

---

## Monitoring & Logs

### Render
- Dashboard shows real-time logs
- Automatic error tracking

### Railway
- Logs tab shows all output
- Deployments are versioned

### Replit
- Console shows live output
- Click "Stop" to restart

---

## Support

If deployment fails:

1. Check logs for error messages
2. Verify all files copied correctly: `ls dist/`
3. Ensure Node version compatibility
4. Run locally first: `npm install && npm start`

---

**Choose Render or Railway for best experience with your IFEX Node.js application!**

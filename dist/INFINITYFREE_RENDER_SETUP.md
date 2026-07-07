# Deploy IFEX Split: Frontend on InfinityFree + Backend on Render

This guide covers deploying your frontend to InfinityFree and backend to Render, with them communicating together.

---

## Architecture Overview

```
┌──────────────────────────────────────────┐
│  Your Domain: ifex.kesug.com             │
│  (InfinityFree - Frontend only)           │
├──────────────────────────────────────────┤
│  • React frontend (static files)          │
│  • HTML, CSS, JS                          │
│  • Communicates with Render API           │
└──────────────────────────────────────────┘
                    ↓
            (API calls to)
                    ↓
┌──────────────────────────────────────────┐
│  Render Backend                          │
│  • Node.js/Express server                │
│  • REST API endpoints                    │
│  • Database (content.json)               │
└──────────────────────────────────────────┘
```

---

## PART 1: Deploy Frontend to InfinityFree

### Prerequisites

- ✅ InfinityFree account (free hosting)
- ✅ Domain connected (ifex.kesug.com)
- ✅ FTP credentials from InfinityFree

### Step 1: Prepare Frontend Files

The frontend files are already built in `dist/public/`. We just need to upload them to InfinityFree.

**Files to upload:**
```
dist/public/
├── index.html
├── *.png (images)
└── assets/ (all JS/CSS files)
```

### Step 2: Get InfinityFree FTP Credentials

1. Log in to InfinityFree control panel
2. Go to **Files** → **FTP Manager**
3. Click **Create FTP Account**
4. Create account for your domain (ifex.kesug.com)
5. Note the credentials:
   - **FTP Host:** (provided by InfinityFree)
   - **Username:** (provided)
   - **Password:** (provided)

### Step 3: Upload Files via FTP

**Using FileZilla (recommended free FTP client):**

1. Download FileZilla: https://filezilla-project.org/
2. Open FileZilla
3. Go to **File** → **Site Manager**
4. Click "New Site"
5. Enter InfinityFree credentials:
   - Host: (your FTP host)
   - Username: (your FTP username)
   - Password: (your FTP password)
6. Connect
7. Navigate to the `public_html` folder
8. Upload all files from `dist/public/` here

**Or using Windows Explorer:**
1. Open File Manager
2. Type in address bar: `ftp://your-ftp-host`
3. Enter credentials
4. Drag and drop files from `dist/public/` to `public_html/`

### Step 4: Test Frontend

Once uploaded, visit: **https://ifex.kesug.com/**

You should see your IFEX website! (It may show API errors - that's normal, we'll fix that next)

---

## PART 2: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up (use GitHub login)

### Step 2: Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Set up with these values:

| Setting | Value |
|---------|-------|
| **Name** | `ifex-api` |
| **Environment** | `Node` |
| **Region** | `Oregon (us-west)` |
| **Branch** | `main` |
| **Root Directory** | `dist/server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Step 3: Set Environment Variables

In Render dashboard, go to **Environment**:

```
NODE_ENV = production
PORT = 3000
CORS_ORIGIN = https://ifex.kesug.com
```

**Important:** Set `CORS_ORIGIN` to your InfinityFree domain so the frontend can call the API!

### Step 4: Add Persistent Disk

1. Click **"Add Disk"**
2. **Mount Path:** `/app/data`
3. **Size:** 1 GB

This stores your database.

### Step 5: Deploy

Click **"Create Web Service"** and wait 2-3 minutes.

**Your Render API will be available at:** (Render will show you the URL)
Example: `https://ifex-api.onrender.com`

---

## PART 3: Connect Frontend to Backend API

Now we need to tell the frontend where to find the backend API.

### Update API Configuration

Edit `dist/server/server-combined.js` to configure CORS with your Render URL:

Find this line:
```javascript
app.use(cors());
```

Replace with:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

### Update Frontend API Endpoint

Create/update `dist/public/config.js`:

```javascript
// Frontend API Configuration
window.API_URL = 'https://ifex-api.onrender.com/api';
// Use this in your frontend calls instead of hardcoded URLs
```

Or update your React frontend code to use environment variable. Edit your API calls to point to:

```javascript
const API_URL = 'https://ifex-api.onrender.com/api';

// Example API call
fetch(`${API_URL}/services`)
  .then(res => res.json())
  .then(data => console.log(data))
```

**Replace `ifex-api.onrender.com` with your actual Render URL!**

### Step 4: Push & Redeploy

```bash
cd F:\ifex-fixed-smtp-hosting\ifex - Copy\IFEX

git add .
git commit -m "Connect frontend to Render backend"
git push origin main
```

Render will automatically rebuild and redeploy! ✅

### Step 5: Re-upload Frontend

Since we updated the frontend code, upload the new files to InfinityFree:

```bash
# Rebuild frontend if you made changes
cd frontend
npm run build

# Copy new files to dist/public
xcopy frontend\dist\* dist\public\ /E /Y
```

Then re-upload `dist/public/` to InfinityFree via FTP.

---

## Testing the Connection

### Test 1: Frontend Loads
Visit: **https://ifex.kesug.com/**
Should load without errors ✓

### Test 2: Backend API Works
Visit: **https://ifex-api.onrender.com/api/health**
Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}
```

### Test 3: Frontend Calls Backend
Open browser developer tools (F12) on https://ifex.kesug.com/
Go to **Console**
You should see no CORS errors ✓

---

## Troubleshooting

### Frontend shows "Cannot reach API"

1. **Check CORS settings:**
   - Verify `CORS_ORIGIN=https://ifex.kesug.com` in Render
   - Restart Render service

2. **Check API URL in frontend:**
   - Make sure frontend uses correct Render API URL
   - Check browser console for actual error

3. **Test API directly:**
   - Visit `https://ifex-api.onrender.com/api/health` in browser
   - Should return `{"status":"ok"}`

### Frontend not updating on InfinityFree

1. **Hard refresh browser:**
   - Ctrl+Shift+Delete (clear cache)
   - Then refresh page

2. **Check files were uploaded:**
   - Use FileZilla to verify files in `public_html/`

### Backend not starting on Render

1. **Check Render logs:**
   - Go to Render dashboard
   - Click your service
   - Check "Logs" tab
   - Look for error messages

2. **Verify dependencies:**
   - Make sure `dist/server/package.json` exists
   - Has all required packages (express, cors, etc.)

---

## Summary

| Component | Host | URL | Notes |
|-----------|------|-----|-------|
| **Frontend** | InfinityFree | https://ifex.kesug.com/ | Static files only |
| **API** | Render | https://ifex-api.onrender.com | (auto-generated URL) |
| **Database** | Render Disk | /app/data | Persistent storage |

---

## Next Steps

1. ✅ Upload frontend to InfinityFree
2. ✅ Deploy backend to Render
3. ✅ Configure CORS and API URLs
4. ✅ Test the connection
5. Monitor logs for errors
6. Celebrate! 🎉

---

## Auto Deployments

**Frontend:** Manual (upload to InfinityFree FTP when needed)

**Backend:** Automatic! 
- Push code to GitHub
- Render auto-rebuilds and deploys
- Your API updates instantly

---

## Keep API URL Updated

If your Render API URL changes (unlikely), update:
1. Frontend code (API calls)
2. Re-upload to InfinityFree

If your domain changes:
1. Update `CORS_ORIGIN` in Render
2. Render automatically restarts with new settings

---

**Questions? Check individual deployment guides:**
- `RENDER_SETUP.md` for Render details
- InfinityFree help center for FTP issues

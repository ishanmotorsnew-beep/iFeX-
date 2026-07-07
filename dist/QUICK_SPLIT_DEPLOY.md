# Quick Setup: InfinityFree + Render Split Deployment

## Your Setup

```
Frontend: https://ifex.kesug.com/ (on InfinityFree)
Backend API: https://[your-render-url].onrender.com (on Render)
```

---

## 🚀 5-Step Quick Setup

### Step 1: Deploy Backend to Render (5 mins)

**Go to:** https://render.com

1. Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repository
4. Set:
   - **Name:** `ifex-api`
   - **Root Directory:** `dist/server`
   - **Build:** `npm install`
   - **Start:** `npm start`

5. Click **"Create"** and wait for deployment

**Copy your Render URL when it appears!**
- Example: `https://ifex-api-abc123.onrender.com`

---

### Step 2: Configure Render Environment

In Render dashboard for your service:

1. Go to **"Settings"** → **"Environment"**
2. Add these variables:

```
NODE_ENV = production
CORS_ORIGIN = https://ifex.kesug.com
```

3. **Save** - Render auto-restarts with new settings

---

### Step 3: Update Frontend API Configuration

**Edit:** `dist/public/api-config.js`

Find this line:
```javascript
const PROD_API_URL = 'https://ifex-api.onrender.com/api';
```

Replace with your actual Render URL:
```javascript
const PROD_API_URL = 'https://ifex-api-abc123.onrender.com/api';
//                   ↑ Use your actual Render URL
```

---

### Step 4: Push to GitHub

```bash
cd F:\ifex-fixed-smtp-hosting\ifex - Copy\IFEX

git add dist/
git commit -m "Update API configuration for Render deployment"
git push origin main
```

Render auto-redeploys automatically! ✅

---

### Step 5: Upload Frontend to InfinityFree

**Using FileZilla (recommended):**

1. Download: https://filezilla-project.org/
2. Open Site Manager
3. Create new site:
   - **Host:** Your InfinityFree FTP host
   - **User:** Your FTP username
   - **Pass:** Your FTP password
4. Connect
5. Navigate to `public_html/` folder
6. Drag files from `dist/public/` into it

**That's it!** Visit https://ifex.kesug.com/ 🎉

---

## ✅ Verify Everything Works

### Test 1: Frontend loads
```
https://ifex.kesug.com/
```
Should show your IFEX website ✓

### Test 2: Backend API works
```
https://[your-render-url].onrender.com/api/health
```
Should show:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### Test 3: Frontend calls Backend
- Open https://ifex.kesug.com/
- Press F12 (Developer Tools)
- Check Console for errors
- Should say "API Configuration loaded" ✓

---

## 📋 Checklist

Before uploading, verify:

- [ ] `dist/public/api-config.js` has correct Render URL
- [ ] `dist/public/index.html` exists
- [ ] `dist/public/assets/` folder has files
- [ ] Render service created and running
- [ ] `CORS_ORIGIN=https://ifex.kesug.com` set in Render
- [ ] FTP credentials ready for InfinityFree

---

## 🔧 If Something Goes Wrong

**Frontend not loading?**
1. Check files uploaded to `public_html/` on InfinityFree
2. Try hard refresh: Ctrl+Shift+Delete then F5

**API not working?**
1. Visit `https://[your-render-url].onrender.com/api/health`
2. Check Render logs for errors
3. Verify `CORS_ORIGIN` in Render settings

**CORS errors?**
1. Update `CORS_ORIGIN` in Render to exactly: `https://ifex.kesug.com`
2. Wait 30 seconds for Render to restart

---

## 📚 Full Documentation

- See `INFINITYFREE_RENDER_SETUP.md` for detailed guide
- See `RENDER_SETUP.md` for Render specifics
- See `README.md` for API endpoints

---

## Your URLs

Save these for reference:

```
Frontend:    https://ifex.kesug.com/
Backend API: https://[YOUR-RENDER-URL].onrender.com/api
Health Check: https://[YOUR-RENDER-URL].onrender.com/api/health
Services:    https://[YOUR-RENDER-URL].onrender.com/api/services
Portfolio:   https://[YOUR-RENDER-URL].onrender.com/api/portfolio
```

---

**Ready? Start with Step 1: https://render.com** 🚀

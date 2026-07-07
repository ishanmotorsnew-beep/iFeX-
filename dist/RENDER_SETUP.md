# Deploy IFEX to Render.com - Step by Step

Render.com is perfect for your IFEX application. It's **free**, easy to use, and supports Node.js out of the box.

---

## ✅ Prerequisites

- ✅ GitHub account (https://github.com)
- ✅ Render.com account (https://render.com)
- ✅ Your IFEX code in a GitHub repository
- ✅ `dist/` folder ready for deployment

---

## Step 1: Push Your Code to GitHub

First, push your complete project (including the `dist/` folder) to GitHub:

```bash
cd F:\ifex-fixed-smtp-hosting\ifex - Copy\IFEX

git add .
git commit -m "Add production dist folder with frontend, server, and database"
git push origin main
```

**Check that these files are pushed:**
- `dist/public/` (frontend build)
- `dist/server/` (backend code)
- `dist/data/` (database)
- `dist/QUICKSTART.md`
- `dist/README.md`

---

## Step 2: Create a Render Web Service

1. **Go to https://render.com**
2. **Sign up** (use GitHub login for easier setup)
3. **Click "New +"** button → Select **"Web Service"**

### Connect GitHub
- Select **"Connect account"** under GitHub
- Authorize Render to access your repositories
- Select your IFEX repository

### Configure the Web Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `ifex` (or anything you like) |
| **Environment** | `Node` |
| **Region** | `Oregon (us-west)` |
| **Branch** | `main` |
| **Root Directory** | `dist/server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Important Settings

Scroll down and set:

**Environment Variables:**
```
NODE_ENV = production
PORT = 3000
```

**Persistent Disk:**
- Click "Add Disk"
- **Mount Path:** `/app/data`
- **Size:** 1 GB (for your database)

---

## Step 3: Deploy!

1. Click **"Create Web Service"**
2. Render will start building (this takes 2-3 minutes)
3. Watch the logs for "Server started"
4. Your URL will appear at the top (like `https://ifex.onrender.com`)

---

## ✅ Your App is Live!

Once deployed:

**Frontend:** https://ifex.onrender.com  
**API:** https://ifex.onrender.com/api  
**Services:** https://ifex.onrender.com/api/services  
**Portfolio:** https://ifex.onrender.com/api/portfolio  

---

## 🔑 Important: Keep Your Disk Data

Your database (`dist/data/content.json`) is saved on the persistent disk.

**To back up your data:**
1. Go to your Render dashboard
2. Click your web service
3. Go to "Disks" tab
4. You can download files from the disk

---

## 🚨 Potential Issues & Solutions

### Issue 1: "Cannot find module"
**Solution:** Make sure `dist/server/package.json` exists and dependencies are installed locally first.

```bash
cd dist/server
npm install
```

### Issue 2: Port already in use
**Solution:** Render sets PORT automatically. No action needed.

### Issue 3: Database not persisting
**Solution:** 
- Verify disk is mounted at `/app/data`
- Ensure code writes to `/app/data/content.json` (path is correct)
- Restart the service

### Issue 4: Frontend not loading
**Solution:**
1. Check that `dist/public/index.html` exists
2. Verify logs show "Server started"
3. Try visiting the health endpoint: `https://your-url/api/health`

---

## 📊 Monitor Your App

**In Render Dashboard:**
- **Logs** - See what your app is doing
- **Events** - View deployment history
- **Metrics** - CPU, memory usage
- **Disks** - Manage your database files

---

## 🔄 Auto Deploy on Code Changes

After initial setup, **Render automatically redeploys** when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Updated content"
git push origin main

# Render automatically rebuilds and deploys! 🚀
```

---

## 💰 Free Tier Limits

- ✅ 750 hours/month CPU
- ✅ 1 GB persistent disk (free)
- ✅ Custom domain (with free .onrender.com)
- ✅ HTTPS/SSL included
- ✅ Unlimited deployments

That's **plenty** for a single web service!

---

## 🎯 What Happens Behind the Scenes

When you deploy to Render:

1. Render pulls your code from GitHub
2. Reads `dist/server/package.json`
3. Runs: `npm install` (installs dependencies)
4. Runs: `npm start` (starts your server with `server-combined.js`)
5. Server starts at port 3000 (auto-detected)
6. Render gives you a public URL
7. Your persistent disk is mounted at `/app/data` (database saved here)

All automatic! ✨

---

## ✨ Next Steps After Deployment

1. **Test your app:** Visit your Render URL
2. **Add a custom domain** (optional):
   - Go to Settings → Custom Domains
   - Point your domain's DNS to Render
3. **Monitor logs** if anything goes wrong
4. **Keep pushing code** - automatic deployments work great!

---

## 🆘 Need Help?

**Check these first:**
1. Render logs for error messages
2. This guide's troubleshooting section
3. `DEPLOYMENT_GUIDE.md` in your project

**Render Support:** https://render.com/docs

---

## 📝 Quick Checklist

Before clicking "Create Web Service":

- [ ] Code pushed to GitHub
- [ ] `dist/server/` folder exists
- [ ] `dist/public/` has files
- [ ] `dist/data/content.json` exists
- [ ] GitHub repository selected
- [ ] Root Directory: `dist/server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Persistent Disk mounted at `/app/data`
- [ ] Environment: NODE_ENV=production

---

**You're ready! Go to https://render.com and create a new Web Service! 🚀**

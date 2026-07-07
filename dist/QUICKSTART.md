# 🚀 IFEX - Quick Start Guide

## 30-Second Startup

### Windows
1. Open `dist/server/start.bat` by double-clicking it
2. Wait for the message "Server started"
3. Open browser: http://localhost:3000

### Mac/Linux
1. Open terminal in `dist/server/`
2. Run: `chmod +x start.sh && ./start.sh`
3. Open browser: http://localhost:3000

---

## What Just Happened?

✅ **Frontend** (React app) is served at http://localhost:3000  
✅ **Backend API** is running at http://localhost:3000/api  
✅ **Database** (content.json) is ready at `dist/data/content.json`  

All running from a **single Node.js server**!

---

## 📂 File Structure Created

```
dist/
├── public/                  # Compiled React app (ready to deploy)
├── server/
│   ├── start.bat           # ⭐ Click this on Windows
│   ├── start.sh            # ⭐ Run this on Mac/Linux
│   ├── server-combined.js  # Serves frontend + API
│   └── package.json        # Node.js dependencies
├── data/
│   └── content.json        # Your database
├── README.md               # Full documentation
├── DEPLOYMENT_GUIDE.md     # How to deploy online
├── Dockerfile              # Docker support
└── docker-compose.yml      # Docker Compose support
```

---

## 🌐 Accessing Your Application

| What | URL |
|------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3000/api |
| Services | http://localhost:3000/api/services |
| Portfolio | http://localhost:3000/api/portfolio |
| Health Check | http://localhost:3000/api/health |

---

## ⚙️ Common Tasks

### Stop the server
Press `Ctrl+C` in the terminal

### Change the port
```bash
PORT=5000 npm start
```

### View/Edit database
Open `dist/data/content.json` in any text editor

### Deploy online
See `DEPLOYMENT_GUIDE.md` for:
- Render.com (recommended, free)
- Railway.app (free)
- Replit (free & easy)
- Docker

---

## 🔍 Troubleshooting

**"Port 3000 already in use"**
```bash
PORT=3001 npm start
```

**"Cannot find module 'express'"**
```bash
cd dist/server
npm install
npm start
```

**"Frontend not loading"**
- Clear browser cache (Ctrl+Shift+Delete)
- Check http://localhost:3000/api/health returns `{"status":"ok"}`

---

## 📚 Next Steps

1. **Explore the API** - Test endpoints in the browser or Postman
2. **Customize content** - Edit `dist/data/content.json`
3. **Deploy online** - Follow `DEPLOYMENT_GUIDE.md`
4. **Learn more** - Read full `README.md`

---

## ✨ Key Features

- ✅ Frontend & Backend in one package
- ✅ No database setup needed (JSON file)
- ✅ Can run with single command
- ✅ Ready for production deployment
- ✅ Docker-ready
- ✅ Free hosting options available

---

**Ready? Double-click `dist/server/start.bat` or run `./start.sh` and visit http://localhost:3000!**

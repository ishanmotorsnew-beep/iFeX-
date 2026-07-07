# IFEX Distribution Package

This is a complete, production-ready distribution package containing the frontend build, server code, and database files for the IFEX project.

## 🚀 Quick Start

### Windows
```bash
cd server
start.bat
```

### Mac/Linux
```bash
cd server
chmod +x start.sh
./start.sh
```

Then open: **http://localhost:3000**

---

## 📁 Directory Structure

```
dist/
├── public/                          # Frontend build (static React app)
│   ├── index.html                   # Main entry point
│   ├── assets/                      # Bundled CSS, JS, and images
│   └── *.png                        # Static assets
├── server/                          # Backend server
│   ├── server-combined.js           # Combined server (serves both frontend & API)
│   ├── server.js                    # Original API server
│   ├── auth.js                      # Authentication logic
│   ├── contentStore.js              # Content management
│   ├── package.json                 # Dependencies
│   ├── start.bat                    # Windows startup script
│   ├── start.sh                     # Linux/Mac startup script
│   └── lib/
│       └── imageUrls.js             # Image configuration
├── data/                            # Database files
│   └── content.json                 # Application database (JSON)
├── Dockerfile                       # Docker configuration
├── docker-compose.yml               # Docker Compose configuration
├── DEPLOYMENT_GUIDE.md              # Deployment instructions
└── README.md                        # This file
```

---

## 🛠️ Setup & Running

### Automatic Startup (Recommended)

**Windows:**
- Double-click `server/start.bat`

**Linux/Mac:**
- Open terminal in `server/` directory
- Run: `chmod +x start.sh && ./start.sh`

### Manual Setup

```bash
cd server
npm install
npm start
```

**Access the application:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

---

## 🌐 API Endpoints

### Content Management
- `GET /api/content` - Get all content
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create/update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/portfolio` - Get portfolio items
- `POST /api/portfolio` - Create portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item
- `GET /api/health` - Health check

---

## 📦 Deployment Options

### 1️⃣ Free Node.js Hosting (Recommended)

See **DEPLOYMENT_GUIDE.md** for detailed instructions:
- ✅ **Render.com** (recommended)
- ✅ **Railway.app**
- ✅ **Replit**

⚠️ **Note:** InfinityFree does NOT support Node.js. Use Render or Railway instead.

### 2️⃣ Docker Deployment

```bash
# Build and run with Docker
docker-compose up

# Or build manually
docker build -t ifex .
docker run -p 3000:3000 ifex
```

### 3️⃣ Traditional Hosting

Deploy `server/` folder to any Node.js hosting service:
- **Heroku** (now paid, but instructions available)
- **AWS** (EC2, Lambda, or ECS)
- **DigitalOcean** (droplets)
- **Linode**
- **Vultr**
- **Your own VPS**

---

## ⚙️ Configuration

### Environment Variables

Create `.env` in `server/` directory:
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

### Database

- **File Location:** `data/content.json`
- **Format:** JSON (human-readable)
- **Auto-created:** Yes (on first run)
- **Backup:** Manually copy `data/content.json` regularly

---

## 🔒 Security Notes

1. **Keep database backups** - The JSON file contains all your data
2. **Use HTTPS in production** - Render/Railway provide free SSL
3. **Set strong admin passwords** - If using authentication
4. **Restrict CORS** - Update `CORS_ORIGIN` for your domain
5. **Environment variables** - Keep sensitive data in `.env`, never commit it

---

## 📊 Production Checklist

Before deploying:
- [ ] Database file exists: `data/content.json`
- [ ] All dependencies installed: `npm install`
- [ ] Frontend build complete: `public/` has files
- [ ] `NODE_ENV=production` set
- [ ] Port configured correctly
- [ ] Database backups created
- [ ] Tested locally first

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change port in code or use environment variable
PORT=3001 npm start
```

**Dependencies missing:**
```bash
cd server
npm install
```

**Database errors:**
- Delete `data/content.json` (will be recreated)
- Check file permissions

**Frontend not loading:**
- Verify `public/` folder has files
- Check browser console for errors
- Clear browser cache

---

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **server/package.json** - Dependencies and scripts
- **server/server-combined.js** - Server source code

---

## 🤝 Support

For issues:
1. Check application logs in terminal
2. Verify database exists: `data/content.json`
3. Test API health: `http://localhost:3000/api/health`
4. Review **DEPLOYMENT_GUIDE.md** for platform-specific help

---

**Ready to deploy? Start with DEPLOYMENT_GUIDE.md!**

# Quick Supabase Setup - 5 Minutes

Your IFEX deployment with **Supabase PostgreSQL** database.

```
Frontend: https://ifex.kesug.com/ (InfinityFree)
Backend:  https://ifex-api.onrender.com (Render)
Database: Supabase PostgreSQL (managed)
```

---

## ⚡ 3-Step Setup

### Step 1: Create Supabase Project (2 mins)

1. Go to **https://supabase.com**
2. Sign up (use GitHub login)
3. Create project:
   - **Name:** `ifex`
   - **Password:** (save it)
   - **Region:** Pick one
4. Wait for initialization

### Step 2: Create Database Tables (2 mins)

In Supabase dashboard:

1. Go **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy & paste this:

```sql
-- Create Tables
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_services_created ON services(created_at DESC);
CREATE INDEX idx_portfolio_created ON portfolio(created_at DESC);
CREATE INDEX idx_portfolio_category ON portfolio(category);
```

4. Click **"Run"**

### Step 3: Get Credentials & Configure Render (1 min)

In Supabase:
1. Go **Settings** → **API**
2. Copy:
   - **Project URL**
   - **Anon Key**

In Render dashboard for your service:
1. Go **Settings** → **Environment**
2. Add these variables:

```
SUPABASE_URL = [your Supabase URL]
SUPABASE_ANON_KEY = [your Anon Key]
NODE_ENV = production
CORS_ORIGIN = https://ifex.kesug.com
```

3. **Save** - Render restarts automatically!

---

## ✅ Test It

Visit: `https://[your-render-url]/api/health`

Should show:
```json
{
  "status": "ok",
  "database": "Supabase PostgreSQL"
}
```

---

## 📊 Your Stack

| Component | Host | Type |
|-----------|------|------|
| **Frontend** | InfinityFree | Static HTML/CSS/JS |
| **API** | Render | Node.js/Express |
| **Database** | Supabase | PostgreSQL |

---

## 🔄 How It Works

1. User visits `https://ifex.kesug.com/`
2. Browser loads frontend from InfinityFree
3. Frontend calls API: `https://[your-render-url]/api/...`
4. Render backend queries Supabase
5. Data flows back to frontend ✓

---

## 📝 Next Steps

1. ✅ Frontend uploaded to InfinityFree
2. ✅ Backend running on Render
3. ✅ Database configured on Supabase
4. Add test data in Supabase Table Editor
5. Verify API calls work

---

## 💡 Pro Tips

✅ **Add test data:** Go to Supabase → Table Editor → Add rows  
✅ **Monitor API:** Check Render logs in dashboard  
✅ **Backup:** Supabase auto-backs up daily  
✅ **Scale:** Supabase handles millions of rows  

---

## 🆘 Troubleshooting

**API returns database error?**
- Check Supabase credentials in Render
- Verify tables exist in Supabase
- Restart Render service

**Can't connect to Supabase?**
- Verify Project URL format
- Check Anon Key is correct
- Test query in Supabase SQL Editor

**Frontend API calls failing?**
- Check `CORS_ORIGIN` in Render is set correctly
- Open browser console (F12) for error details
- Verify Render service is "Live"

---

**See SUPABASE_SETUP.md for detailed guide!**

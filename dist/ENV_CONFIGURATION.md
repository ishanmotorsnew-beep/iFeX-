# Environment Configuration Guide

How to set up Supabase for IFEX in different environments.

---

## Environment Variables

Your server needs these variables to connect to Supabase:

```env
# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-key-here

# Server Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://ifex.kesug.com
```

---

## Setup by Environment

### 🖥️ Local Development

Create `.env` file in `dist/server/`:

```bash
cd dist/server
echo "SUPABASE_URL=https://your-project.supabase.co" > .env
echo "SUPABASE_ANON_KEY=your-public-key-here" >> .env
echo "NODE_ENV=development" >> .env
echo "CORS_ORIGIN=*" >> .env
```

Then run:
```bash
npm start
```

Server reads from `.env` automatically via environment variables.

### 🌐 Render Production

**In Render Dashboard:**

1. Select your service
2. Go to **Settings** → **Environment**
3. Click **"Add Environment Variable"**
4. Add each variable:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | `your-public-key-here` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://ifex.kesug.com` |

5. **Save** - Render restarts automatically

### 🏠 InfinityFree (Frontend Only)

InfinityFree doesn't need Supabase credentials (it's just static files).

Only Render backend needs the credentials.

---

## Getting Supabase Credentials

### Find Your Project URL

1. Go to **Supabase Dashboard**
2. Click your project
3. Go to **Settings** → **API**
4. Copy **Project URL** (looks like: `https://xxxx.supabase.co`)

### Find Your Anon Key

Same location (**Settings** → **API**):
- Copy the **Anon Key** (public, safe to share)

⚠️ **Don't share the Service Role Key!** (that's secret)

---

## Verifying Configuration

### Check Local Setup

```bash
cd dist/server
npm start
```

Look for output:
```
Testing Supabase connection...
✓ Supabase connection successful
```

If you see `✗ Supabase connection failed`, check:
- SUPABASE_URL is correct
- SUPABASE_ANON_KEY is correct
- Tables exist in Supabase

### Check Production Setup

Visit: `https://[your-render-url]/api/health`

Should return:
```json
{
  "status": "ok",
  "database": "Supabase PostgreSQL"
}
```

If it returns `"database": "JSON File (Fallback)"`, credentials aren't set in Render.

---

## Switching Between Databases

### Use Supabase (with credentials)
```bash
npm start  # Uses server-supabase.js (default)
```

### Use JSON Fallback (no Supabase)
```bash
npm run start:json  # Uses server-combined.js
```

---

## Environment Variable Security

### Safe to Share
- ✅ SUPABASE_URL (it's public)
- ✅ SUPABASE_ANON_KEY (public API key)
- ✅ CORS_ORIGIN (it's your domain)

### Never Share
- ❌ SUPABASE_SERVICE_ROLE_KEY (secret key)
- ❌ Database password
- ❌ Any secret authentication tokens

---

## Troubleshooting

### "SUPABASE_URL is not set"

**Solution:** Set environment variable
```bash
export SUPABASE_URL=https://your-project.supabase.co
```

**Or in Render:** Add to Environment section

### "Invalid API key"

**Solution:**
1. Go to Supabase Settings → API
2. Copy **Anon Key** (not Service Role Key)
3. Update in Render Environment

### "Tables don't exist"

**Solution:**
1. Go to Supabase SQL Editor
2. Run the table creation SQL
3. See SUPABASE_SETUP.md for full SQL

### Server still using JSON

**Solution:**
1. Verify SUPABASE_URL and SUPABASE_ANON_KEY are set
2. Restart Render service
3. Check `/api/health` endpoint
4. Should say `"database": "Supabase PostgreSQL"`

---

## Environment Variable Sources (Priority Order)

1. **Render Environment** (production)
2. **.env file** (local development)
3. **System environment** (if set globally)
4. **Fallback to defaults** (if not set)

If SUPABASE credentials not found, server automatically falls back to JSON file database.

---

## Reference

**Server Startup Scripts:**
- `npm start` → Uses Supabase (if configured) or JSON fallback
- `npm run start:supabase` → Forces Supabase
- `npm run start:json` → Forces JSON
- `npm run dev` → Development mode with Supabase

**Configuration Files:**
- `.env` → Local development settings
- Render Settings → Production environment
- `dist/server/package.json` → Scripts

---

**All set? Start with QUICK_SUPABASE_SETUP.md!**

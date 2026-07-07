# Supabase Integration Guide - IFEX Backend

Migrate from JSON file database to **Supabase** (PostgreSQL) for better scalability and reliability.

---

## What is Supabase?

Supabase is an **open-source Firebase alternative** providing:
- ✅ PostgreSQL database (fully managed)
- ✅ Real-time subscriptions
- ✅ REST API (auto-generated)
- ✅ Authentication
- ✅ Free tier (5MB to 1GB storage)
- ✅ Easy migrations

---

## Step 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **"Sign Up"**
3. Use GitHub login (recommended)
4. Create a new project:
   - **Project Name:** `ifex`
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you

5. **Wait for initialization** (2-3 minutes)

---

## Step 2: Create Database Tables

Once your Supabase project is created:

1. Go to **SQL Editor** in left sidebar
2. Click **"New Query"**
3. Paste this SQL:

```sql
-- Create Services table
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Portfolio table
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

-- Create Settings table
CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_services_created ON services(created_at DESC);
CREATE INDEX idx_portfolio_created ON portfolio(created_at DESC);
CREATE INDEX idx_portfolio_category ON portfolio(category);
```

4. Click **"Run"** to create tables

---

## Step 3: Get Supabase Credentials

1. Go to **Settings** → **API** in sidebar
2. Copy these values:
   - **Project URL:** (your API endpoint)
   - **Anon Key:** (public API key)
   - **Service Role Key:** (secret key - keep safe!)

3. Also get **Database Password** from Project Settings

Save these - you'll need them!

---

## Step 4: Update Backend to Use Supabase

### Install Supabase Client

```bash
cd dist/server
npm install @supabase/supabase-js
```

### Create Supabase Configuration File

Create `dist/server/supabase-client.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  console.error('Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Update Server to Use Supabase

Replace `dist/server/server-combined.js` database functions:

```javascript
import { supabase } from './supabase-client.js';

// ============ API ROUTES ============

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Service not found' });
    res.json(data);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create/Update service
app.post('/api/services', async (req, res) => {
  try {
    const { id, name, description, icon } = req.body;
    
    if (id) {
      // Update
      const { data, error } = await supabase
        .from('services')
        .update({ name, description, icon, updated_at: new Date() })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      res.json({ success: true, data: data[0] });
    } else {
      // Create
      const { data, error } = await supabase
        .from('services')
        .insert({ name, description, icon })
        .select();
      
      if (error) throw error;
      res.json({ success: true, data: data[0] });
    }
  } catch (error) {
    console.error('Error saving service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio items
app.get('/api/portfolio', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio item
app.post('/api/portfolio', async (req, res) => {
  try {
    const { title, description, image_url, link, category } = req.body;
    
    const { data, error } = await supabase
      .from('portfolio')
      .insert({ title, description, image_url, link, category })
      .select();
    
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete portfolio item
app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('services')
      .select('count', { count: 'exact' });
    
    if (error) throw error;
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: ENV,
      database: 'Supabase PostgreSQL'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});
```

---

## Step 5: Configure Environment Variables

### On Render

Go to your Render dashboard → Your Service → **Settings** → **Environment**

Add these variables:
```
SUPABASE_URL = (your Supabase URL from Step 3)
SUPABASE_ANON_KEY = (your Anon Key from Step 3)
NODE_ENV = production
CORS_ORIGIN = https://ifex.kesug.com
```

**Save** - Render auto-restarts!

### Locally (for testing)

Create `.env` in `dist/server/`:
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=development
```

Load in server code:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

---

## Step 6: Test the Connection

### Local Testing

```bash
cd dist/server
npm install @supabase/supabase-js
npm start
```

Visit: `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "ok",
  "database": "Supabase PostgreSQL"
}
```

### Production Testing

Once deployed to Render, visit:
```
https://ifex-api.onrender.com/api/health
```

---

## Step 7: Migrate Data (Optional)

If you have existing JSON data to migrate:

```javascript
// Script to migrate from JSON to Supabase
import fs from 'fs';
import { supabase } from './supabase-client.js';

async function migrateData() {
  try {
    // Read old JSON file
    const oldData = JSON.parse(
      fs.readFileSync('../data/content.json', 'utf8')
    );

    // Insert services
    if (oldData.services && oldData.services.length > 0) {
      const { error } = await supabase
        .from('services')
        .insert(oldData.services);
      if (error) throw error;
      console.log('Services migrated!');
    }

    // Insert portfolio
    if (oldData.portfolio && oldData.portfolio.length > 0) {
      const { error } = await supabase
        .from('portfolio')
        .insert(oldData.portfolio);
      if (error) throw error;
      console.log('Portfolio migrated!');
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
```

---

## Step 8: Push to GitHub

```bash
cd F:\ifex-fixed-smtp-hosting\ifex - Copy\IFEX

# Update package.json with Supabase
npm install @supabase/supabase-js

git add .
git commit -m "Integrate Supabase PostgreSQL database"
git push origin main
```

Render auto-rebuilds! ✅

---

## Benefits of Supabase

| Feature | JSON File | Supabase |
|---------|-----------|----------|
| **Scalability** | Limited | Unlimited |
| **Real-time** | No | Yes |
| **Backup** | Manual | Automatic |
| **Queries** | Basic | Advanced SQL |
| **Users** | No | Built-in auth |
| **Cost** | Free | Free tier generous |

---

## Supabase Dashboard Features

### View Your Data
- Go to **Table Editor** to see all records
- Add/edit/delete data directly
- See schema and relationships

### Manage Backups
- Automatic daily backups
- Manual backup anytime
- Point-in-time recovery

### Monitor Performance
- Query performance insights
- Database size limits
- API request counts

---

## Troubleshooting

### "Missing Supabase credentials"
- Verify environment variables set in Render
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Restart service in Render

### "Connection timeout"
- Check Supabase project is active
- Verify API key is correct
- Check internet connectivity

### "Row not found"
- Verify table exists in Supabase
- Check data was inserted
- Test query in Supabase SQL Editor

---

## Next Steps

1. ✅ Create Supabase account
2. ✅ Create database tables (SQL)
3. ✅ Get credentials
4. ✅ Update backend code
5. ✅ Set environment variables
6. ✅ Test locally
7. ✅ Push to GitHub
8. ✅ Verify on Render

---

## Resources

- **Supabase Docs:** https://supabase.com/docs
- **JavaScript Client:** https://supabase.com/docs/reference/javascript
- **Database Guide:** https://supabase.com/docs/guides/database

---

**You're now using a production-grade PostgreSQL database! 🚀**

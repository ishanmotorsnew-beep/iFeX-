/**
 * IFEX Combined Server - with Supabase Integration
 * This file starts an Express server that:
 * - Serves static frontend files from ../public
 * - Provides API endpoints for content management
 * - Uses Supabase PostgreSQL (primary) or JSON fallback
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase, testConnection } from './supabase-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'production';

// Detect if using Supabase
const USE_SUPABASE = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database path (for fallback)
const dataDir = path.join(__dirname, '../data');
const contentFile = path.join(dataDir, 'content.json');

// Ensure data directory exists (fallback)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(contentFile)) {
  fs.writeFileSync(contentFile, JSON.stringify({ services: [], portfolio: [], settings: {} }, null, 2));
}

// Fallback: JSON file functions
function readDatabase() {
  try {
    return JSON.parse(fs.readFileSync(contentFile, 'utf8'));
  } catch (error) {
    console.error('Error reading database:', error);
    return { services: [], portfolio: [], settings: {} };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(contentFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// ============ API ROUTES ============

// Get all content
app.get('/api/content', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const [services, portfolio, settings] = await Promise.all([
        supabase.from('services').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*')
      ]);
      
      res.json({
        services: services.data || [],
        portfolio: portfolio.data || [],
        settings: settings.data || []
      });
    } else {
      res.json(readDatabase());
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get services
app.get('/api/services', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } else {
      const data = readDatabase();
      res.json(data.services || []);
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', parseInt(req.params.id))
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Service not found' });
      res.json(data);
    } else {
      const data = readDatabase();
      const service = data.services?.find(s => s.id === req.params.id);
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: 'Service not found' });
      }
    }
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create/Update service
app.post('/api/services', async (req, res) => {
  try {
    const { id, name, description, icon } = req.body;
    
    if (USE_SUPABASE) {
      if (id) {
        // Update
        const { data, error } = await supabase
          .from('services')
          .update({ name, description, icon, updated_at: new Date() })
          .eq('id', parseInt(id))
          .select();
        
        if (error) throw error;
        res.json({ success: true, data: data[0] });
      } else {
        // Create
        const { data, error } = await supabase
          .from('services')
          .insert([{ name, description, icon }])
          .select();
        
        if (error) throw error;
        res.json({ success: true, data: data[0] });
      }
    } else {
      const data = readDatabase();
      if (!data.services) data.services = [];
      
      const index = data.services.findIndex(s => s.id === id);
      if (index >= 0) {
        data.services[index] = { id, name, description, icon };
      } else {
        data.services.push({ id: Date.now().toString(), name, description, icon });
      }
      
      if (writeDatabase(data)) {
        res.json({ success: true, data: data.services });
      } else {
        res.status(500).json({ error: 'Failed to save service' });
      }
    }
  } catch (error) {
    console.error('Error saving service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', parseInt(req.params.id));
      
      if (error) throw error;
      res.json({ success: true });
    } else {
      const data = readDatabase();
      data.services = data.services.filter(s => s.id !== req.params.id);
      
      if (writeDatabase(data)) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete service' });
      }
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio items
app.get('/api/portfolio', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } else {
      const data = readDatabase();
      res.json(data.portfolio || []);
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio item
app.post('/api/portfolio', async (req, res) => {
  try {
    const { title, description, image_url, link, category } = req.body;
    
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('portfolio')
        .insert([{ title, description, image_url, link, category }])
        .select();
      
      if (error) throw error;
      res.json({ success: true, data: data[0] });
    } else {
      const data = readDatabase();
      if (!data.portfolio) data.portfolio = [];
      
      const newItem = {
        id: Date.now().toString(),
        title,
        description,
        image_url,
        link,
        category,
        createdAt: new Date().toISOString()
      };
      
      data.portfolio.push(newItem);
      
      if (writeDatabase(data)) {
        res.json({ success: true, data: newItem });
      } else {
        res.status(500).json({ error: 'Failed to create portfolio item' });
      }
    }
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete portfolio item
app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', parseInt(req.params.id));
      
      if (error) throw error;
      res.json({ success: true });
    } else {
      const data = readDatabase();
      data.portfolio = data.portfolio.filter(p => p.id !== req.params.id);
      
      if (writeDatabase(data)) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete portfolio item' });
      }
    }
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    if (USE_SUPABASE) {
      const { error } = await supabase
        .from('services')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (error) throw error;
      
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: ENV,
        database: 'Supabase PostgreSQL'
      });
    } else {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: ENV,
        database: 'JSON File (Fallback)'
      });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// ============ STATIC FILES ============

// Serve static files from public directory
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// SPA fallback - serve index.html for all unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, async () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  IFEX SERVER STARTED                                       ║
╠════════════════════════════════════════════════════════════╣
║  Server:   http://localhost:${PORT}                           ║
║  Frontend: http://localhost:${PORT}                           ║
║  API:      http://localhost:${PORT}/api                      ║
║  Database: ${USE_SUPABASE ? 'Supabase PostgreSQL' : 'JSON File (Fallback)'}
║  Environment: ${ENV}                                        ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Test Supabase connection if configured
  if (USE_SUPABASE) {
    console.log('\nTesting Supabase connection...');
    const connected = await testConnection();
    if (!connected) {
      console.warn('⚠️  Supabase connection failed - server will still work but may be offline');
    }
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down gracefully...');
  process.exit(0);
});

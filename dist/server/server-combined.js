/**
 * Combined Server - Serves both frontend and backend API
 * This file starts an Express server that:
 * - Serves static frontend files from ../public
 * - Provides API endpoints for content management and authentication
 * - Connects to the database in ../data/content.json
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'production';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database path
const dataDir = path.join(__dirname, '../data');
const contentFile = path.join(dataDir, 'content.json');

// Ensure data directory and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(contentFile)) {
  fs.writeFileSync(contentFile, JSON.stringify({ services: [], portfolio: [], settings: {} }, null, 2));
}

// Helper function to read database
function readDatabase() {
  try {
    return JSON.parse(fs.readFileSync(contentFile, 'utf8'));
  } catch (error) {
    console.error('Error reading database:', error);
    return { services: [], portfolio: [], settings: {} };
  }
}

// Helper function to write database
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
app.get('/api/content', (req, res) => {
  const data = readDatabase();
  res.json(data);
});

// Get services
app.get('/api/services', (req, res) => {
  const data = readDatabase();
  res.json(data.services || []);
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
  const data = readDatabase();
  const service = data.services?.find(s => s.id === req.params.id);
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Create/Update service
app.post('/api/services', (req, res) => {
  const data = readDatabase();
  const { id, name, description, icon } = req.body;
  
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
});

// Delete service
app.delete('/api/services/:id', (req, res) => {
  const data = readDatabase();
  data.services = data.services.filter(s => s.id !== req.params.id);
  
  if (writeDatabase(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get portfolio items
app.get('/api/portfolio', (req, res) => {
  const data = readDatabase();
  res.json(data.portfolio || []);
});

// Create portfolio item
app.post('/api/portfolio', (req, res) => {
  const data = readDatabase();
  if (!data.portfolio) data.portfolio = [];
  
  const newItem = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  data.portfolio.push(newItem);
  
  if (writeDatabase(data)) {
    res.json({ success: true, data: newItem });
  } else {
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

// Delete portfolio item
app.delete('/api/portfolio/:id', (req, res) => {
  const data = readDatabase();
  data.portfolio = data.portfolio.filter(p => p.id !== req.params.id);
  
  if (writeDatabase(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: ENV 
  });
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
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  IFEX SERVER STARTED                   ║
╠════════════════════════════════════════╣
║  Server:   http://localhost:${PORT}       ║
║  Frontend: http://localhost:${PORT}       ║
║  API:      http://localhost:${PORT}/api   ║
║  Database: ${contentFile}
║  Environment: ${ENV}                      ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down gracefully...');
  process.exit(0);
});

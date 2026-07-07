#!/usr/bin/env node

/**
 * IFEX Quick Setup & Test
 * This script verifies the distribution package is ready and provides setup help
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╔════════════════════════════════════════════════════════════╗
║           IFEX - Quick Setup & Verification               ║
╚════════════════════════════════════════════════════════════╝
`);

const checks = {
  'Database file': () => fs.existsSync(path.join(__dirname, '../data/content.json')),
  'Frontend build': () => fs.existsSync(path.join(__dirname, '../public/index.html')),
  'Server code': () => fs.existsSync(path.join(__dirname, 'server-combined.js')),
  'Package.json': () => fs.existsSync(path.join(__dirname, 'package.json')),
  'Node modules': () => fs.existsSync(path.join(__dirname, 'node_modules'))
};

let allGood = true;
for (const [name, check] of Object.entries(checks)) {
  const status = check() ? '✓' : '✗';
  const color = check() ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${name}`);
  if (!check()) allGood = false;
}

console.log(`
────────────────────────────────────────────────────────────
`);

if (!allGood) {
  console.log('⚠️  Some checks failed. Please follow setup instructions:\n');
  console.log('1. Install dependencies:');
  console.log('   npm install\n');
  console.log('2. Run the startup script:');
  if (process.platform === 'win32') {
    console.log('   Windows: start.bat\n');
  } else {
    console.log('   Linux/Mac: ./start.sh\n');
  }
} else {
  console.log('✓ All checks passed! Your IFEX distribution is ready.\n');
  console.log('To start the application:\n');
  if (process.platform === 'win32') {
    console.log('  1. Double-click: start.bat\n');
  } else {
    console.log('  1. Run: ./start.sh\n');
  }
  console.log('  2. Open browser: http://localhost:3000\n');
}

console.log(`
Deployment Options:
  • Local: npm start
  • Render: https://render.com (free & easy)
  • Railway: https://railway.app
  • Replit: https://replit.com
  • Docker: docker-compose up

See DEPLOYMENT_GUIDE.md for detailed instructions.
`);

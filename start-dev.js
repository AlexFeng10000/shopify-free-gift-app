#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎁 Starting Shopify Free Gift App Development Server...\n');

// Check if dependencies are installed
const checks = [
  { path: 'node_modules', name: 'Root dependencies' },
  { path: 'server/node_modules', name: 'Server dependencies' },
  { path: 'client/node_modules', name: 'Client dependencies' }
];

let missingDeps = false;

checks.forEach(check => {
  if (!fs.existsSync(check.path)) {
    console.log(`❌ ${check.name} not installed`);
    missingDeps = true;
  } else {
    console.log(`✅ ${check.name} installed`);
  }
});

if (missingDeps) {
  console.log('\n💡 Run this first: npm run install-all');
  process.exit(1);
}

// Check environment files
if (!fs.existsSync('server/.env')) {
  console.log('⚠️  server/.env not found - creating default...');
  fs.copyFileSync('server/.env.example', 'server/.env');
}

if (!fs.existsSync('client/.env')) {
  console.log('⚠️  client/.env not found - creating default...');
  fs.writeFileSync('client/.env', 'REACT_APP_SHOPIFY_API_KEY=your_api_key_here\nGENERATE_SOURCEMAP=false');
}

console.log('\n🚀 Starting development servers...\n');

// Start the development servers (avoid infinite loop)
const child = spawn('npm', ['run', 'dev-direct'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Failed to start development servers:', error.message);
});

child.on('exit', (code) => {
  console.log(`\n👋 Development servers stopped with code ${code}`);
});
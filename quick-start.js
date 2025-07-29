#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎁 Setting up your Shopify Free Gift App...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this from the shopify-free-gift-app directory');
  process.exit(1);
}

try {
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🖥️ Installing server dependencies...');
  process.chdir('server');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🎨 Installing client dependencies...');
  process.chdir('../client');
  execSync('npm install', { stdio: 'inherit' });

  process.chdir('..');

  console.log('\n✅ Installation complete!');
  console.log('\n🔧 Next steps:');
  console.log('1. Update server/.env with your Shopify app credentials');
  console.log('2. Run: npm run dev');
  console.log('3. Open http://localhost:3000');
  console.log('\n📖 See SETUP_GUIDE.md for detailed instructions');

} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
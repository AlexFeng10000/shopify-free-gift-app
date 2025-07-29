#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking your Shopify Free Gift App setup...\n');

const checks = [
  {
    name: 'Root package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Run the quick-start.js script'
  },
  {
    name: 'Server dependencies installed',
    check: () => fs.existsSync('server/node_modules'),
    fix: 'Run: cd server && npm install'
  },
  {
    name: 'Client dependencies installed', 
    check: () => fs.existsSync('client/node_modules'),
    fix: 'Run: cd client && npm install'
  },
  {
    name: 'Server .env file exists',
    check: () => fs.existsSync('server/.env'),
    fix: 'Copy server/.env.example to server/.env'
  },
  {
    name: 'Client .env file exists',
    check: () => fs.existsSync('client/.env'),
    fix: 'Create client/.env with REACT_APP_SHOPIFY_API_KEY'
  },
  {
    name: 'Shopify API key configured',
    check: () => {
      if (!fs.existsSync('server/.env')) return false;
      const env = fs.readFileSync('server/.env', 'utf8');
      return !env.includes('your_api_key_here');
    },
    fix: 'Update SHOPIFY_API_KEY in server/.env with your actual API key'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 Setup looks good! Ready to run:');
  console.log('   npm run dev');
} else {
  console.log('⚠️  Please fix the issues above, then run:');
  console.log('   node check-setup.js');
}

console.log('\n📖 See SETUP_GUIDE.md for detailed instructions');
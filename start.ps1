# Shopify Free Gift App Startup Script for Windows PowerShell

Write-Host "🎁 Starting Shopify Free Gift App..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "💡 Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    Write-Host "💡 Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check and install dependencies
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
    npm install
}

if (!(Test-Path "server/node_modules")) {
    Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

if (!(Test-Path "client/node_modules")) {
    Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

# Create .env files if they don't exist
if (!(Test-Path "server/.env")) {
    Write-Host "⚙️ Creating server .env file..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
}

if (!(Test-Path "client/.env")) {
    Write-Host "⚙️ Creating client .env file..." -ForegroundColor Yellow
    @"
REACT_APP_SHOPIFY_API_KEY=your_api_key_here
GENERATE_SOURCEMAP=false
"@ | Out-File -FilePath "client/.env" -Encoding UTF8
}

Write-Host ""
Write-Host "🚀 Starting development servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers using concurrently
npm run dev-direct
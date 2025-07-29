# Vercel Environment Variables Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""

# Check Vercel authentication
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Blue
try {
    $whoami = vercel whoami 2>$null
    Write-Host "✅ Authenticated as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel login failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""

# Get Vercel app URL
Write-Host "📝 Please enter your Vercel app URL" -ForegroundColor Yellow
Write-Host "Example: https://shopify-free-gift-app.vercel.app" -ForegroundColor Gray
Write-Host "Your URL: " -NoNewline -ForegroundColor Cyan
$vercelUrl = Read-Host

# Trim whitespace and validate
$vercelUrl = $vercelUrl.Trim()

if ([string]::IsNullOrEmpty($vercelUrl)) {
    Write-Host "❌ Vercel URL is required" -ForegroundColor Red
    Write-Host "Please run the script again and enter your Vercel app URL" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Validate URL format
if (-not $vercelUrl.StartsWith("https://")) {
    Write-Host "❌ URL must start with https://" -ForegroundColor Red
    Write-Host "Example: https://your-app.vercel.app" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Extract hostname from URL
$uri = [System.Uri]$vercelUrl
$hostName = $uri.Host

Write-Host ""
Write-Host "🚀 Setting up environment variables..." -ForegroundColor Blue
Write-Host ""

# Environment variables to set
$envVars = @{
    "SHOPIFY_API_KEY" = "0a84e1df4c003abfab2f61d8344ea04b"
    "SHOPIFY_API_SECRET" = "90636fd6406e3aede92601aa79a52350"
    "SHOPIFY_SCOPES" = "read_products,write_products,read_orders,write_draft_orders"
    "SHOPIFY_APP_URL" = $vercelUrl
    "HOST" = $hostName
    "NODE_ENV" = "production"
    "PORT" = "5000"
    "DATABASE_URL" = "./database.sqlite"
    "REACT_APP_SHOPIFY_API_KEY" = "0a84e1df4c003abfab2f61d8344ea04b"
    "GENERATE_SOURCEMAP" = "false"
}

# Set each environment variable
foreach ($key in $envVars.Keys) {
    Write-Host "Setting $key..." -ForegroundColor Yellow
    $value = $envVars[$key]
    
    # Use echo to pipe the value to vercel env add
    $value | vercel env add $key production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $key set successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to set $key" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Environment variables setup complete!" -ForegroundColor Green
Write-Host ""

# Ask if user wants to trigger deployment
$deploy = Read-Host "🔄 Would you like to trigger a new deployment? (y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "Deploying to production..." -ForegroundColor Blue
    vercel --prod
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your app should now be deployed with all environment variables." -ForegroundColor Green
Write-Host "Visit: $vercelUrl" -ForegroundColor Blue
Write-Host ""
Read-Host "Press Enter to exit"
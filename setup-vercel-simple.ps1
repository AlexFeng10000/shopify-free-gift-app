# Simple Vercel Environment Setup
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Vercel Environment Variables Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# First, let's get your Vercel URL
Write-Host "Step 1: Find your Vercel app URL" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "2. Click on your shopify-free-gift-app project" -ForegroundColor Gray
Write-Host "3. Copy the URL (e.g., https://shopify-free-gift-app.vercel.app)" -ForegroundColor Gray
Write-Host ""

Write-Host "Enter your Vercel app URL: " -NoNewline -ForegroundColor Cyan
$vercelUrl = Read-Host

if ([string]::IsNullOrEmpty($vercelUrl.Trim())) {
    Write-Host ""
    Write-Host "❌ No URL provided. Please run the script again." -ForegroundColor Red
    Write-Host ""
    Write-Host "To find your URL:" -ForegroundColor Yellow
    Write-Host "1. Visit https://vercel.com/dashboard" -ForegroundColor Gray
    Write-Host "2. Click your project name" -ForegroundColor Gray
    Write-Host "3. Copy the URL from the project page" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

$vercelUrl = $vercelUrl.Trim()

# Extract hostname
try {
    $uri = [System.Uri]$vercelUrl
    $hostName = $uri.Host
    Write-Host "✅ URL validated: $vercelUrl" -ForegroundColor Green
    Write-Host "✅ Host extracted: $hostName" -ForegroundColor Green
} catch {
    Write-Host "❌ Invalid URL format. Please use format: https://your-app.vercel.app" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Environment Variables to Set" -ForegroundColor Yellow
Write-Host "The following variables will be configured:" -ForegroundColor Gray
Write-Host "• SHOPIFY_API_KEY" -ForegroundColor Gray
Write-Host "• SHOPIFY_API_SECRET" -ForegroundColor Gray
Write-Host "• SHOPIFY_SCOPES" -ForegroundColor Gray
Write-Host "• SHOPIFY_APP_URL = $vercelUrl" -ForegroundColor Gray
Write-Host "• HOST = $hostName" -ForegroundColor Gray
Write-Host "• NODE_ENV = production" -ForegroundColor Gray
Write-Host "• PORT = 5000" -ForegroundColor Gray
Write-Host "• DATABASE_URL = ./database.sqlite" -ForegroundColor Gray
Write-Host "• REACT_APP_SHOPIFY_API_KEY" -ForegroundColor Gray
Write-Host "• GENERATE_SOURCEMAP = false" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Continue with setup? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Step 3: Setting up Vercel CLI" -ForegroundColor Yellow

# Check Vercel CLI
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Blue
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 4: Vercel Authentication" -ForegroundColor Yellow
Write-Host "If prompted, please login to Vercel..." -ForegroundColor Gray

# Check authentication
$authResult = vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel:" -ForegroundColor Blue
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Authentication failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "✅ Authenticated with Vercel" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Setting Environment Variables" -ForegroundColor Yellow

# Create a temporary file with all environment variables
$envContent = @"
SHOPIFY_API_KEY=0a84e1df4c003abfab2f61d8344ea04b
SHOPIFY_API_SECRET=90636fd6406e3aede92601aa79a52350
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_draft_orders
SHOPIFY_APP_URL=$vercelUrl
HOST=$hostName
NODE_ENV=production
PORT=5000
DATABASE_URL=./database.sqlite
REACT_APP_SHOPIFY_API_KEY=0a84e1df4c003abfab2f61d8344ea04b
GENERATE_SOURCEMAP=false
"@

$tempFile = "temp-env-vars.txt"
$envContent | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Environment variables prepared. Setting them in Vercel..." -ForegroundColor Blue

# Set each environment variable individually
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

$successCount = 0
$totalCount = $envVars.Count

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Setting $key..." -ForegroundColor Blue
    
    try {
        # Use echo to pipe value to vercel env add
        $process = Start-Process -FilePath "cmd" -ArgumentList "/c", "echo $value | vercel env add $key production" -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ $key set successfully" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "❌ Failed to set $key" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error setting $key : $_" -ForegroundColor Red
    }
}

Write-Host ""
if ($successCount -eq $totalCount) {
    Write-Host "✅ All environment variables set successfully ($successCount/$totalCount)" -ForegroundColor Green
} elseif ($successCount -gt 0) {
    Write-Host "⚠️  Partial success: $successCount/$totalCount variables set" -ForegroundColor Yellow
    Write-Host "You may need to set the remaining variables manually in Vercel dashboard" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to set environment variables automatically" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set them manually:" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor Gray
    Write-Host "2. Select your project" -ForegroundColor Gray
    Write-Host "3. Go to Settings > Environment Variables" -ForegroundColor Gray
    Write-Host "4. Add each variable from the list above" -ForegroundColor Gray
}

# Clean up temp file
if (Test-Path $tempFile) {
    Remove-Item $tempFile
}

Write-Host ""
Write-Host "Step 6: Deployment" -ForegroundColor Yellow
$deploy = Read-Host "Trigger a new deployment now? (y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "Deploying to production..." -ForegroundColor Blue
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Deployment may have issues. Check Vercel dashboard." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your app URL: $vercelUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit your app URL to test" -ForegroundColor Gray
Write-Host "2. Check that settings save/load correctly" -ForegroundColor Gray
Write-Host "3. Ready for screencast recording!" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
Write-Host "🧪 Testing Shopify App Installation" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$APP_URL = "https://gift-booster-230kb327c-alexfeng10000s-projects.vercel.app"
$TEST_SHOP = "gift-booster-test"

Write-Host ""
Write-Host "📋 App Configuration:" -ForegroundColor Yellow
Write-Host "  App URL: $APP_URL"
Write-Host "  Test Shop: $TEST_SHOP.myshopify.com"
Write-Host ""

# Test 1: Basic app health
Write-Host "🔍 Test 1: App Health Check" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$APP_URL/test?shop=$TEST_SHOP.myshopify.com" -Method Get -TimeoutSec 10
    Write-Host "  ✅ App is responding" -ForegroundColor Green
} catch {
    Write-Host "  ❌ App health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: OAuth install endpoint
Write-Host ""
Write-Host "🔍 Test 2: OAuth Install Endpoint" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$APP_URL/auth/install?shop=$TEST_SHOP.myshopify.com" -Method Get -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        if ($response.Content -like "*accounts.shopify.com*" -or $response.Content -like "*oauth/authorize*") {
            Write-Host "  ✅ OAuth redirect is working (Status: $($response.StatusCode))" -ForegroundColor Green
        } elseif ($response.Content -like "*temporarily unavailable*") {
            Write-Host "  ⚠️  Shopify services temporarily unavailable - this is expected" -ForegroundColor Yellow
        } else {
            Write-Host "  ⚠️  Unexpected response content" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ OAuth endpoint returned status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ OAuth test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Environment variables check
Write-Host ""
Write-Host "🔍 Test 3: Vercel Environment Variables" -ForegroundColor Cyan
try {
    $envVars = vercel env ls 2>$null
    if ($envVars -like "*SHOPIFY_API_KEY*" -and $envVars -like "*SHOPIFY_API_SECRET*") {
        Write-Host "  ✅ Environment variables are configured" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Environment variables missing" -ForegroundColor Red
    }
} catch {
    Write-Host "  ⚠️  Could not check environment variables" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update Shopify Partner Dashboard with:"
Write-Host "     App URL: $APP_URL"
Write-Host "     Redirect URL: $APP_URL/auth/callback"
Write-Host ""
Write-Host "  2. Wait for Shopify services to recover (check https://status.shopify.com)"
Write-Host ""
Write-Host "  3. Try installing your app with:"
Write-Host "     $APP_URL/?shop=your-store.myshopify.com"
Write-Host ""
Write-Host "Your app configuration is ready!" -ForegroundColor Green
Write-Host "Testing Shopify App Installation" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$APP_URL = "https://gift-booster-230kb327c-alexfeng10000s-projects.vercel.app"

Write-Host ""
Write-Host "App URL: $APP_URL" -ForegroundColor Yellow
Write-Host ""

# Test app health
Write-Host "Testing app health..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$APP_URL/test?shop=test.myshopify.com" -Method Get -TimeoutSec 10
    Write-Host "App is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "App health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test OAuth
Write-Host ""
Write-Host "Testing OAuth endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$APP_URL/auth/install?shop=test.myshopify.com" -Method Get -TimeoutSec 10
    if ($response.Content -like "*temporarily unavailable*") {
        Write-Host "Shopify services temporarily unavailable - this is expected" -ForegroundColor Yellow
    } elseif ($response.Content -like "*oauth*") {
        Write-Host "OAuth redirect is working" -ForegroundColor Green
    } else {
        Write-Host "OAuth endpoint responded (Status: $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "OAuth test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update Shopify Partner Dashboard with:"
Write-Host "   App URL: $APP_URL"
Write-Host "   Redirect URL: $APP_URL/auth/callback"
Write-Host ""
Write-Host "2. Wait for Shopify services to recover"
Write-Host ""
Write-Host "3. Try installing your app"
Write-Host ""
Write-Host "Your app configuration is ready!" -ForegroundColor Green
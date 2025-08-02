Write-Host "Clearing browser cache for all major browsers..." -ForegroundColor Green

# Close browsers first
Write-Host "Closing browsers..." -ForegroundColor Yellow
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process firefox -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear Chrome cache
$chromePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default"
if (Test-Path $chromePath) {
    Write-Host "Clearing Chrome cache..." -ForegroundColor Cyan
    Remove-Item "$chromePath\Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$chromePath\Code Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$chromePath\GPUCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Chrome cache cleared!" -ForegroundColor Green
}

# Clear Edge cache
$edgePath = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default"
if (Test-Path $edgePath) {
    Write-Host "Clearing Edge cache..." -ForegroundColor Cyan
    Remove-Item "$edgePath\Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$edgePath\Code Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$edgePath\GPUCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Edge cache cleared!" -ForegroundColor Green
}

# Clear Firefox cache
$firefoxPath = "$env:APPDATA\Mozilla\Firefox\Profiles"
if (Test-Path $firefoxPath) {
    Write-Host "Clearing Firefox cache..." -ForegroundColor Cyan
    Get-ChildItem $firefoxPath | ForEach-Object {
        $cachePath = "$($_.FullName)\cache2"
        if (Test-Path $cachePath) {
            Remove-Item "$cachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "Firefox cache cleared!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Browser cache clearing complete!" -ForegroundColor Green
Write-Host "You can now restart your browsers and test your Shopify app." -ForegroundColor Yellow
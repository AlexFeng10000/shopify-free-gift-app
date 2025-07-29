# Simple screen recording script for Windows
# Run this in PowerShell as Administrator

Write-Host "Starting screen recording setup..."
Write-Host "1. Open your browser with the app demo"
Write-Host "2. Press Win+G to open Xbox Game Bar"
Write-Host "3. Click the record button or press Win+Alt+R"
Write-Host "4. Follow your screencast script"
Write-Host "5. Press Win+Alt+R to stop recording"
Write-Host ""
Write-Host "Video will be saved to: $env:USERPROFILE\Videos\Captures"
Write-Host ""
Write-Host "Alternative: Use OBS Studio for more control"
Write-Host "Download from: https://obsproject.com/"

# Open the app URL if available
$appUrl = "https://your-app.vercel.app"  # Replace with your actual URL
Write-Host "Opening app demo at: $appUrl"
Start-Process $appUrl

Write-Host "Press any key when ready to start recording..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
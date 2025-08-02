Write-Host "Setting up Vercel environment variables..." -ForegroundColor Green

# Add SHOPIFY_API_KEY
Write-Host "Adding SHOPIFY_API_KEY..." -ForegroundColor Yellow
"0a84e1df4c003abfab2f61d8344ea04b" | vercel env add SHOPIFY_API_KEY production

# Add SHOPIFY_API_SECRET  
Write-Host "Adding SHOPIFY_API_SECRET..." -ForegroundColor Yellow
"90636fd6406e3aede92601aa79a52350" | vercel env add SHOPIFY_API_SECRET production

# Add SHOPIFY_APP_URL
Write-Host "Adding SHOPIFY_APP_URL..." -ForegroundColor Yellow
"https://gift-booster-ogs3l4y6k-alexfeng10000s-projects.vercel.app" | vercel env add SHOPIFY_APP_URL production

# Add SHOPIFY_SCOPES
Write-Host "Adding SHOPIFY_SCOPES..." -ForegroundColor Yellow
"read_products,write_products,read_orders,write_draft_orders" | vercel env add SHOPIFY_SCOPES production

# Add HOST
Write-Host "Adding HOST..." -ForegroundColor Yellow
"gift-booster-ogs3l4y6k-alexfeng10000s-projects.vercel.app" | vercel env add HOST production

# Add NODE_ENV
Write-Host "Adding NODE_ENV..." -ForegroundColor Yellow
"production" | vercel env add NODE_ENV production

Write-Host "Environment variables setup complete!" -ForegroundColor Green
Write-Host "Now deploying with new environment variables..." -ForegroundColor Green

# Deploy again
vercel --prod

Write-Host "Deployment complete! Your app should now work properly." -ForegroundColor Green
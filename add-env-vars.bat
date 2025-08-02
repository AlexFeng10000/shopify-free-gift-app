@echo off
echo Adding Shopify environment variables to Vercel...

echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add SHOPIFY_API_KEY
echo 90636fd6406e3aede92601aa79a52350 | vercel env add SHOPIFY_API_SECRET  
echo https://gift-booster-f5i4sqs3a-alexfeng10000s-projects.vercel.app | vercel env add SHOPIFY_APP_URL
echo read_products,write_products,read_orders,write_draft_orders | vercel env add SHOPIFY_SCOPES
echo gift-booster-f5i4sqs3a-alexfeng10000s-projects.vercel.app | vercel env add HOST
echo production | vercel env add NODE_ENV

echo.
echo Environment variables added! Now deploying...
vercel --prod

echo.
echo Done! Your app should now work properly.
pause
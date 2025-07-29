# Manual Vercel Environment Setup

## Step 1: Get Your Vercel URL
1. Go to https://vercel.com/dashboard
2. Click on your `shopify-free-gift-app` project
3. Copy the URL (e.g., `https://shopify-free-gift-app-abc123.vercel.app`)

## Step 2: Install Vercel CLI (if not installed)
```cmd
npm install -g vercel
```

## Step 3: Login to Vercel
```cmd
vercel login
```

## Step 4: Set Environment Variables
**Replace `YOUR_VERCEL_URL` with your actual URL from Step 1**

Copy and paste these commands one by one into Command Prompt:

```cmd
echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add SHOPIFY_API_KEY production
```

```cmd
echo 90636fd6406e3aede92601aa79a52350 | vercel env add SHOPIFY_API_SECRET production
```

```cmd
echo read_products,write_products,read_orders,write_draft_orders | vercel env add SHOPIFY_SCOPES production
```

```cmd
echo YOUR_VERCEL_URL | vercel env add SHOPIFY_APP_URL production
```

```cmd
echo YOUR_HOSTNAME | vercel env add HOST production
```

```cmd
echo production | vercel env add NODE_ENV production
```

```cmd
echo 5000 | vercel env add PORT production
```

```cmd
echo ./database.sqlite | vercel env add DATABASE_URL production
```

```cmd
echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add REACT_APP_SHOPIFY_API_KEY production
```

```cmd
echo false | vercel env add GENERATE_SOURCEMAP production
```

## Step 5: Deploy
```cmd
vercel --prod
```

## Example:
If your Vercel URL is `https://shopify-free-gift-app-abc123.vercel.app`, then:
- Replace `YOUR_VERCEL_URL` with `https://shopify-free-gift-app-abc123.vercel.app`
- Replace `YOUR_HOSTNAME` with `shopify-free-gift-app-abc123.vercel.app`

## Alternative: Vercel Dashboard
If the CLI doesn't work, set them via web interface:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add each variable manually
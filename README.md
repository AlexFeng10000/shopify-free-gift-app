# 🎁 Shopify Free Gift App

**Auto Free Gift Adder** - Boost your average order value by automatically adding free gifts when customers reach a spending threshold.

## 🚀 Features

- ✅ **Automatic Gift Addition**: Add free products when cart reaches threshold
- ✅ **Easy Configuration**: Simple admin interface to set thresholds and select gifts
- ✅ **Real-time Analytics**: Track performance and conversion rates
- ✅ **Shopify Integration**: Seamless integration with Shopify Admin API
- ✅ **Mobile Responsive**: Works perfectly on all devices

## 💰 Revenue Potential

- **Target Market**: 2M+ Shopify merchants
- **Pricing**: $29/month subscription
- **Goal**: 500 stores = $14,500 MRR in 12 months

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Shopify Polaris UI
- App Bridge for embedded experience

**Backend:**
- Node.js + Express
- SQLite database
- Shopify Admin API integration

## 📦 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp server/.env.example server/.env

# Add your Shopify app credentials to server/.env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_orders
SHOPIFY_APP_URL=https://your-app-url.com
```

### 3. Development

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend on :5000
npm run client  # Frontend on :3000
```

### 4. Production Build

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
shopify-free-gift-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Settings.js
│   │   │   └── Analytics.js
│   │   └── App.js
│   └── public/
├── server/                 # Node.js backend
│   ├── routes/
│   │   └── gifts.js       # API routes
│   ├── database.js        # SQLite database
│   └── index.js           # Express server
└── README.md
```

## 🔧 API Endpoints

### Gift Settings
- `GET /api/gifts/settings` - Get current settings
- `POST /api/gifts/settings` - Save settings

### Cart Management
- `POST /api/gifts/check-cart` - Check if cart qualifies for gift

### Analytics
- `GET /api/gifts/analytics` - Get performance data
- `POST /api/gifts/analytics` - Log gift events

## 📊 Database Schema

### gift_settings
- `shop_domain` - Store identifier
- `threshold_amount` - Minimum cart value
- `gift_product_id` - Product to give away
- `gift_variant_id` - Specific variant
- `is_active` - Feature enabled/disabled

### gift_analytics
- `shop_domain` - Store identifier
- `cart_total` - Cart value when triggered
- `gift_added` - Whether gift was added
- `created_at` - Timestamp

## 🚀 Deployment Options

### Railway (Recommended)
```bash
# Connect to Railway
railway login
railway init
railway add
railway deploy
```

### Vercel
```bash
# Deploy to Vercel
vercel --prod
```

### Heroku
```bash
# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

## 📈 Marketing Strategy

1. **Shopify App Store**: Primary distribution channel
2. **SEO Keywords**: "free gift", "upsell", "average order value"
3. **Content Marketing**: Blog about e-commerce optimization
4. **Social Proof**: Customer testimonials and case studies

## 🎯 Roadmap

### Phase 1 (Weeks 1-2) - MVP
- [x] Basic gift addition logic
- [x] Admin configuration interface
- [x] Simple analytics dashboard

### Phase 2 (Weeks 3-4) - Enhancement
- [ ] Advanced gift rules (multiple thresholds)
- [ ] Email notifications
- [ ] Better product selection UI

### Phase 3 (Weeks 5-8) - Scale
- [ ] A/B testing features
- [ ] Advanced analytics
- [ ] Multi-language support

## 💡 Success Tips

1. **Start Simple**: Focus on core functionality first
2. **User Feedback**: Get early user feedback and iterate
3. **App Store SEO**: Optimize listing with keywords
4. **Customer Support**: Provide excellent support for reviews
5. **Performance**: Keep the app fast and reliable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own Shopify app!

---

**Ready to boost your Shopify store's revenue? Let's get started! 🚀**
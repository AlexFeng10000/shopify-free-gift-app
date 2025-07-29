const express = require('express');
const router = express.Router();
const database = require('../database');

// Get current gift settings for a shop
router.get('/settings', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain') || 'demo-store.myshopify.com';
    
    console.log(`📖 Fetching settings for shop: ${shopDomain}`);

    const settings = await database.getGiftSettings(shopDomain);
    
    if (!settings) {
      // Return default settings for new shops
      const defaultSettings = {
        threshold_amount: 100.0,
        gift_product_id: null,
        gift_variant_id: null,
        is_active: false
      };
      console.log('📋 Returning default settings');
      return res.json(defaultSettings);
    }

    console.log('📋 Returning saved settings');
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching gift settings:', error);
    // Return default settings even on error to prevent crashes
    res.json({
      threshold_amount: 100.0,
      gift_product_id: null,
      gift_variant_id: null,
      is_active: false
    });
  }
});

// Save gift settings for a shop
router.post('/settings', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const { threshold_amount, gift_product_id, gift_variant_id, is_active } = req.body;

    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop domain required' });
    }

    // Validate required fields
    if (!threshold_amount || threshold_amount <= 0) {
      return res.status(400).json({ error: 'Valid threshold amount required' });
    }

    if (is_active && (!gift_product_id || !gift_variant_id)) {
      return res.status(400).json({ error: 'Gift product and variant required when active' });
    }

    const result = await database.saveGiftSettings(shopDomain, {
      threshold_amount: parseFloat(threshold_amount),
      gift_product_id,
      gift_variant_id,
      is_active: Boolean(is_active)
    });

    res.json({ 
      success: true, 
      message: 'Settings saved successfully',
      id: result.id 
    });
  } catch (error) {
    console.error('Error saving gift settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Check if cart qualifies for free gift
router.post('/check-cart', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const { cart_total, line_items } = req.body;

    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop domain required' });
    }

    const settings = await database.getGiftSettings(shopDomain);
    
    if (!settings || !settings.is_active) {
      return res.json({ qualifies: false, message: 'Gift feature not active' });
    }

    const qualifies = cart_total >= settings.threshold_amount;
    
    // Check if gift is already in cart
    const hasGift = line_items?.some(item => 
      item.product_id === settings.gift_product_id || 
      item.variant_id === settings.gift_variant_id
    );

    res.json({
      qualifies,
      hasGift,
      threshold: settings.threshold_amount,
      gift_product_id: settings.gift_product_id,
      gift_variant_id: settings.gift_variant_id,
      amount_needed: qualifies ? 0 : settings.threshold_amount - cart_total
    });
  } catch (error) {
    console.error('Error checking cart:', error);
    res.status(500).json({ error: 'Failed to check cart' });
  }
});

// Get analytics for dashboard
router.get('/analytics', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const days = parseInt(req.query.days) || 30;

    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop domain required' });
    }

    const analytics = await database.getAnalytics(shopDomain, days);
    
    res.json({
      period_days: days,
      ...analytics,
      conversion_rate: analytics.total_triggers > 0 
        ? (analytics.gifts_added / analytics.total_triggers * 100).toFixed(1)
        : 0
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Log gift analytics (called from storefront)
router.post('/analytics', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const { order_id, cart_total, gift_added } = req.body;

    if (!shopDomain) {
      return res.status(400).json({ error: 'Shop domain required' });
    }

    await database.logGiftAnalytics(shopDomain, {
      order_id,
      cart_total: parseFloat(cart_total),
      gift_added: Boolean(gift_added)
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging analytics:', error);
    res.status(500).json({ error: 'Failed to log analytics' });
  }
});

module.exports = router;
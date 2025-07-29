const express = require('express');
const router = express.Router();
const database = require('../database');

// Get gift tiers for a shop
router.get('/tiers', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain') || 'demo-store.myshopify.com';
    
    console.log(`📖 Fetching gift tiers for shop: ${shopDomain}`);

    const tiers = await database.getGiftTiers(shopDomain);
    
    if (!tiers || tiers.length === 0) {
      // Return default tier for new shops
      const defaultTiers = [{
        id: null,
        threshold_amount: 100.0,
        gift_product_id: 'prod_1',
        gift_variant_id: 'prod_1_var_1',
        gift_description: 'Free gift with $100+ purchase',
        is_active: false,
        tier_order: 0
      }];
      console.log('📋 Returning default tiers');
      return res.json(defaultTiers);
    }

    console.log(`📋 Returning ${tiers.length} saved tiers`);
    res.json(tiers);
  } catch (error) {
    console.error('❌ Error fetching gift tiers:', error);
    res.json([{
      id: null,
      threshold_amount: 100.0,
      gift_product_id: 'prod_1',
      gift_variant_id: 'prod_1_var_1',
      gift_description: 'Free gift with $100+ purchase',
      is_active: false,
      tier_order: 0
    }]);
  }
});

// Save gift tiers for a shop
router.post('/tiers', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain') || 'demo-store.myshopify.com';
    const { tiers } = req.body;

    if (!Array.isArray(tiers)) {
      return res.status(400).json({ error: 'Tiers must be an array' });
    }

    // Validate each tier
    for (const tier of tiers) {
      if (!tier.threshold_amount || tier.threshold_amount <= 0) {
        return res.status(400).json({ error: 'Valid threshold amount required for all tiers' });
      }
      
      if (tier.is_active && (!tier.gift_product_id || !tier.gift_variant_id)) {
        return res.status(400).json({ error: 'Gift product and variant required for active tiers' });
      }
    }

    // Sort tiers by threshold amount
    const sortedTiers = tiers.sort((a, b) => a.threshold_amount - b.threshold_amount);

    const result = await database.saveGiftTiers(shopDomain, sortedTiers);

    res.json({ 
      success: true, 
      message: 'Gift tiers saved successfully',
      tiers_count: tiers.length
    });
  } catch (error) {
    console.error('Error saving gift tiers:', error);
    res.status(500).json({ error: 'Failed to save gift tiers' });
  }
});

// Legacy API endpoints - kept for backward compatibility
// Get current gift settings for a shop (converts from tiers)
router.get('/settings', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain') || 'demo-store.myshopify.com';
    
    console.log(`📖 Fetching legacy settings for shop: ${shopDomain}`);

    // Get tiers and convert to legacy format
    const tiers = await database.getGiftTiers(shopDomain);
    
    if (!tiers || tiers.length === 0) {
      const defaultSettings = {
        threshold_amount: 100.0,
        gift_product_id: null,
        gift_variant_id: null,
        is_active: false
      };
      console.log('📋 Returning default legacy settings');
      return res.json(defaultSettings);
    }

    // Convert first tier to legacy format
    const firstTier = tiers[0];
    const legacySettings = {
      threshold_amount: firstTier.threshold_amount,
      gift_product_id: firstTier.gift_product_id,
      gift_variant_id: firstTier.gift_variant_id,
      is_active: firstTier.is_active
    };

    console.log('📋 Returning converted legacy settings');
    res.json(legacySettings);
  } catch (error) {
    console.error('❌ Error fetching legacy settings:', error);
    res.json({
      threshold_amount: 100.0,
      gift_product_id: null,
      gift_variant_id: null,
      is_active: false
    });
  }
});

// Save gift settings for a shop (converts to single tier)
router.post('/settings', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain') || 'demo-store.myshopify.com';
    const { threshold_amount, gift_product_id, gift_variant_id, is_active } = req.body;

    // Validate required fields
    if (!threshold_amount || threshold_amount <= 0) {
      return res.status(400).json({ error: 'Valid threshold amount required' });
    }

    if (is_active && (!gift_product_id || !gift_variant_id)) {
      return res.status(400).json({ error: 'Gift product and variant required when active' });
    }

    // Convert legacy settings to single tier
    const tier = {
      threshold_amount: parseFloat(threshold_amount),
      gift_product_id,
      gift_variant_id,
      gift_description: `Free gift with $${threshold_amount}+ purchase`,
      is_active: Boolean(is_active)
    };

    const result = await database.saveGiftTiers(shopDomain, [tier]);

    res.json({ 
      success: true, 
      message: 'Settings converted to tier format and saved successfully'
    });
  } catch (error) {
    console.error('Error saving legacy settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Check if cart qualifies for free gifts (multiple tiers)
router.post('/check-cart', async (req, res) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain') || 'demo-store.myshopify.com';
    const { cart_total, line_items } = req.body;

    const tiers = await database.getGiftTiers(shopDomain);
    
    if (!tiers || tiers.length === 0) {
      return res.json({ qualifies: false, message: 'No gift tiers configured' });
    }

    // Find all qualifying tiers
    const qualifyingTiers = tiers.filter(tier => 
      tier.is_active && cart_total >= tier.threshold_amount
    );

    if (qualifyingTiers.length === 0) {
      // Find next tier to reach
      const nextTier = tiers.find(tier => 
        tier.is_active && cart_total < tier.threshold_amount
      );
      
      return res.json({
        qualifies: false,
        qualifying_tiers: [],
        next_tier: nextTier ? {
          threshold: nextTier.threshold_amount,
          amount_needed: nextTier.threshold_amount - cart_total,
          gift_description: nextTier.gift_description
        } : null
      });
    }

    // Check which gifts are already in cart
    const giftsInCart = line_items?.filter(item => 
      qualifyingTiers.some(tier => 
        item.product_id === tier.gift_product_id || 
        item.variant_id === tier.gift_variant_id
      )
    ) || [];

    res.json({
      qualifies: true,
      qualifying_tiers: qualifyingTiers.map(tier => ({
        id: tier.id,
        threshold: tier.threshold_amount,
        gift_product_id: tier.gift_product_id,
        gift_variant_id: tier.gift_variant_id,
        gift_description: tier.gift_description,
        already_in_cart: giftsInCart.some(item => 
          item.product_id === tier.gift_product_id || 
          item.variant_id === tier.gift_variant_id
        )
      })),
      gifts_in_cart: giftsInCart.length
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
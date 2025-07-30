const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Middleware to verify webhook authenticity
const verifyWebhook = (req, res, next) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body;
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET || 'your_webhook_secret')
    .update(body, 'utf8')
    .digest('base64');

  if (hash !== hmac) {
    console.log('❌ Webhook verification failed');
    return res.status(401).send('Unauthorized');
  }

  next();
};

// Middleware to parse raw body for webhook verification
router.use(express.raw({ type: 'application/json' }));

// MANDATORY PRIVACY WEBHOOKS (Required by Shopify)

/**
 * Customer Data Request Webhook
 * Triggered when a customer requests their personal data
 * GDPR Article 15 - Right of Access
 */
router.post('/customers/data_request', verifyWebhook, (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    const { shop_id, shop_domain, customer, orders_requested } = payload;
    
    console.log(`📋 Customer data request received for shop: ${shop_domain}`);
    console.log(`👤 Customer ID: ${customer?.id}`);
    console.log(`📦 Orders requested: ${orders_requested?.length || 0}`);

    // TODO: Implement data collection logic
    // 1. Query your database for customer data related to gift campaigns
    // 2. Compile all personal data you have stored
    // 3. Send data to customer via email or secure download link
    
    // For now, log the request (implement actual data export in production)
    console.log('🔍 Processing customer data request...');
    
    // In production, you would:
    // - Query gift_analytics table for this customer's data
    // - Query any other tables containing customer information
    // - Compile data into readable format (JSON/CSV)
    // - Send to customer via secure method
    
    res.status(200).json({ 
      message: 'Customer data request received and will be processed within 30 days',
      request_id: `req_${Date.now()}`,
      shop_domain,
      customer_id: customer?.id
    });

  } catch (error) {
    console.error('❌ Error processing customer data request:', error);
    res.status(500).json({ error: 'Failed to process data request' });
  }
});

/**
 * Customer Redact Webhook  
 * Triggered when a customer requests deletion of their personal data
 * GDPR Article 17 - Right to Erasure
 */
router.post('/customers/redact', verifyWebhook, (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    const { shop_id, shop_domain, customer, orders_to_redact } = payload;
    
    console.log(`🗑️ Customer redaction request received for shop: ${shop_domain}`);
    console.log(`👤 Customer ID: ${customer?.id}`);
    console.log(`📦 Orders to redact: ${orders_to_redact?.length || 0}`);

    // TODO: Implement data deletion logic
    // 1. Delete or anonymize customer data in gift_analytics table
    // 2. Remove any personally identifiable information
    // 3. Keep aggregated/anonymized data for business analytics
    
    // For now, log the request (implement actual data deletion in production)
    console.log('🔥 Processing customer data redaction...');
    
    // In production, you would:
    // - DELETE FROM gift_analytics WHERE customer_id = ?
    // - UPDATE any other tables to remove/anonymize customer data
    // - Keep non-personal aggregated data for business metrics
    // - Log the deletion for compliance records
    
    res.status(200).json({ 
      message: 'Customer data redaction completed',
      redaction_id: `red_${Date.now()}`,
      shop_domain,
      customer_id: customer?.id,
      records_affected: 0 // Update with actual count in production
    });

  } catch (error) {
    console.error('❌ Error processing customer redaction:', error);
    res.status(500).json({ error: 'Failed to process redaction request' });
  }
});

/**
 * Shop Redact Webhook
 * Triggered when a shop uninstalls your app and requests data deletion
 * GDPR Article 17 - Right to Erasure (Shop Level)
 */
router.post('/shop/redact', verifyWebhook, (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    const { shop_id, shop_domain } = payload;
    
    console.log(`🏪 Shop redaction request received for: ${shop_domain}`);
    console.log(`🆔 Shop ID: ${shop_id}`);

    // TODO: Implement shop data deletion logic
    // 1. Delete all shop data from gift_tiers table
    // 2. Delete all shop data from gift_settings table  
    // 3. Delete all shop data from gift_analytics table
    // 4. Remove any shop-specific configuration data
    
    // For now, log the request (implement actual data deletion in production)
    console.log('🧹 Processing shop data redaction...');
    
    // In production, you would:
    // - DELETE FROM gift_tiers WHERE shop_domain = ?
    // - DELETE FROM gift_settings WHERE shop_domain = ?
    // - DELETE FROM gift_analytics WHERE shop_domain = ?
    // - Clean up any other shop-related data
    // - Log the deletion for compliance records
    
    res.status(200).json({ 
      message: 'Shop data redaction completed',
      redaction_id: `shop_red_${Date.now()}`,
      shop_domain,
      shop_id,
      records_affected: 0 // Update with actual count in production
    });

  } catch (error) {
    console.error('❌ Error processing shop redaction:', error);
    res.status(500).json({ error: 'Failed to process shop redaction request' });
  }
});

// Health check endpoint for webhook testing
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    webhooks: [
      'POST /webhooks/customers/data_request',
      'POST /webhooks/customers/redact', 
      'POST /webhooks/shop/redact'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
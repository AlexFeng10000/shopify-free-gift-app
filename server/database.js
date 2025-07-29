const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'database.sqlite');
let db;

const init = () => {
  try {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
        throw err;
      } else {
        console.log('✅ Connected to SQLite database at:', dbPath);
        createTables();
      }
    });
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    // Create a mock database object to prevent crashes
    db = {
      run: () => {},
      get: (query, params, callback) => callback(null, null),
      all: (query, params, callback) => callback(null, [])
    };
  }
};

const createTables = () => {
  // Store multiple gift tiers for each shop
  db.run(`
    CREATE TABLE IF NOT EXISTS gift_tiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_domain TEXT NOT NULL,
      threshold_amount REAL NOT NULL,
      gift_product_id TEXT,
      gift_variant_id TEXT,
      gift_description TEXT,
      is_active BOOLEAN DEFAULT 1,
      tier_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Legacy table kept for API compatibility only
  db.run(`
    CREATE TABLE IF NOT EXISTS gift_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_domain TEXT UNIQUE NOT NULL,
      threshold_amount REAL DEFAULT 100.0,
      gift_product_id TEXT,
      gift_variant_id TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Track gift additions for analytics
  db.run(`
    CREATE TABLE IF NOT EXISTS gift_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_domain TEXT NOT NULL,
      order_id TEXT,
      cart_total REAL,
      gift_tier_id INTEGER,
      gift_added BOOLEAN,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables created/verified');
};

// Get all gift tiers for a shop
const getGiftTiers = (shopDomain) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM gift_tiers WHERE shop_domain = ? ORDER BY threshold_amount ASC',
      [shopDomain],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

// Save multiple gift tiers
const saveGiftTiers = (shopDomain, tiers) => {
  return new Promise((resolve, reject) => {
    // Start transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      // Delete existing tiers for this shop
      db.run('DELETE FROM gift_tiers WHERE shop_domain = ?', [shopDomain]);
      
      // Insert new tiers
      const stmt = db.prepare(`
        INSERT INTO gift_tiers 
        (shop_domain, threshold_amount, gift_product_id, gift_variant_id, gift_description, is_active, tier_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      tiers.forEach((tier, index) => {
        stmt.run([
          shopDomain,
          tier.threshold_amount,
          tier.gift_product_id,
          tier.gift_variant_id,
          tier.gift_description || '',
          tier.is_active !== false,
          index
        ]);
      });
      
      stmt.finalize();
      
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  });
};

// Legacy function for backward compatibility
const getGiftSettings = (shopDomain) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM gift_settings WHERE shop_domain = ?',
      [shopDomain],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

// Legacy function for backward compatibility
const saveGiftSettings = (shopDomain, settings) => {
  return new Promise((resolve, reject) => {
    const { threshold_amount, gift_product_id, gift_variant_id, is_active } = settings;
    
    db.run(
      `INSERT OR REPLACE INTO gift_settings 
       (shop_domain, threshold_amount, gift_product_id, gift_variant_id, is_active, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [shopDomain, threshold_amount, gift_product_id, gift_variant_id, is_active],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const logGiftAnalytics = (shopDomain, data) => {
  return new Promise((resolve, reject) => {
    const { order_id, cart_total, gift_added } = data;
    
    db.run(
      'INSERT INTO gift_analytics (shop_domain, order_id, cart_total, gift_added) VALUES (?, ?, ?, ?)',
      [shopDomain, order_id, cart_total, gift_added],
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getAnalytics = (shopDomain, days = 30) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
         COUNT(*) as total_triggers,
         COUNT(CASE WHEN gift_added = 1 THEN 1 END) as gifts_added,
         AVG(cart_total) as avg_cart_value
       FROM gift_analytics 
       WHERE shop_domain = ? AND created_at >= datetime('now', '-${days} days')`,
      [shopDomain],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0] || { total_triggers: 0, gifts_added: 0, avg_cart_value: 0 });
      }
    );
  });
};

module.exports = {
  init,
  getGiftTiers,
  saveGiftTiers,
  getGiftSettings,
  saveGiftSettings,
  logGiftAnalytics,
  getAnalytics
};
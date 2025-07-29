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
  // Store settings for each shop
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
      gift_added BOOLEAN,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables created/verified');
};

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
  getGiftSettings,
  saveGiftSettings,
  logGiftAnalytics,
  getAnalytics
};
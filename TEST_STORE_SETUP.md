# Test Store Setup for Reviewers

## Products to Add to Test Store

### Gift Products (Free Items)
1. **Sample Gift Mug**
   - Price: $0.00
   - SKU: GIFT-MUG-001
   - Inventory: 100 units
   - Description: "Complimentary branded mug - Gift with Purchase"

2. **Free Sticker Pack**
   - Price: $0.00
   - SKU: GIFT-STICKER-001
   - Inventory: 500 units
   - Description: "Free sticker pack for qualifying orders"

3. **Sample Keychain**
   - Price: $0.00
   - SKU: GIFT-KEY-001
   - Inventory: 200 units
   - Description: "Branded keychain - promotional gift"

### Regular Products (For Testing Thresholds)
1. **T-Shirt**
   - Price: $25.00
   - SKU: TSHIRT-001
   - Inventory: 50 units

2. **Hoodie**
   - Price: $55.00
   - SKU: HOODIE-001
   - Inventory: 30 units

3. **Backpack**
   - Price: $85.00
   - SKU: BACKPACK-001
   - Inventory: 20 units

## Gift Campaigns to Configure

### Campaign 1: Basic Gift
- **Threshold**: $50.00
- **Gift Product**: Sample Gift Mug
- **Status**: Active
- **Description**: "Free mug with orders over $50"

### Campaign 2: Premium Gift
- **Threshold**: $100.00
- **Gift Product**: Sample Keychain
- **Status**: Active
- **Description**: "Free keychain with orders over $100"

### Campaign 3: Sticker Promotion
- **Threshold**: $25.00
- **Gift Product**: Free Sticker Pack
- **Status**: Active
- **Description**: "Free stickers with any order over $25"

## Test Scenarios for Reviewers

### Scenario 1: Basic Functionality
1. Add T-Shirt ($25) to cart
2. Verify sticker pack automatically added
3. Proceed to checkout

### Scenario 2: Threshold Testing
1. Add items totaling $49.99
2. Verify no gift added
3. Add $0.01 item to reach $50
4. Verify mug automatically added

### Scenario 3: Multiple Gifts
1. Add items totaling $100+
2. Verify multiple gifts added (stickers + mug + keychain)
3. Test gift removal/re-addition

### Scenario 4: Analytics Testing
1. Complete several test orders
2. View analytics dashboard
3. Check conversion tracking
4. Verify gift performance metrics

## Reviewer Access Instructions

### Store Access
- **Store URL**: [your-test-store].myshopify.com
- **Admin Access**: Via Shopify Partners dashboard
- **App Location**: Apps → Gift with Purchase

### Testing Checklist
- [ ] Install app successfully
- [ ] Configure gift campaigns
- [ ] Test cart functionality
- [ ] Verify gift auto-addition
- [ ] Check analytics dashboard
- [ ] Test settings modifications
- [ ] Verify mobile responsiveness
- [ ] Test checkout process
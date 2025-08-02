# Testing Instructions for Gift Booster (2800 char limit)

## Quick Setup
1. Install app on development store
2. Open app from Shopify admin Apps section
3. Verify App Bridge status shows ✅ (green checkmarks)
4. Click "Manage Gift Tiers" on dashboard

## Create Multi-Tier Strategy
### Add Three Tiers:
1. **Tier 1**: Threshold $25, select any product, description "Free sticker pack", keep Active checked
2. **Tier 2**: Threshold $50, different product, description "Free keychain", keep Active checked  
3. **Tier 3**: Threshold $100, higher-value product, description "Premium tote bag", keep Active checked
4. Click "Save All Tiers" - app redirects to dashboard

## Test Core Features
### Dashboard Verification:
- All 3 tiers display in "Gift Configuration" section
- Each shows correct threshold and active status
- Green "Gift Tiers Active" banner appears

### Tier Management:
1. Return to "Manage Gift Tiers"
2. Edit any threshold amount
3. Toggle tier active/inactive status
4. Delete and re-add a tier
5. Save changes and verify dashboard updates

## Expected Behavior
- **$25 purchase**: Gets sticker pack only
- **$50 purchase**: Gets sticker pack + keychain  
- **$100 purchase**: Gets all three gifts (progressive rewards)

## Key Features to Verify
✅ Can add unlimited tiers
✅ Higher tiers include lower-tier gifts
✅ Dashboard updates in real-time
✅ Prevents duplicate thresholds (shows error)
✅ Auto-sorts tiers by amount
✅ Mobile responsive interface
✅ App Bridge integration working (status shows ✅)

## Test Validation
1. Try same threshold on two tiers (should error)
2. Set threshold to 0 (should error)
3. Activate tier without product (should error)
4. Refresh browser - verify data persists

## No Setup Required
- Works immediately after installation
- No external accounts needed
- Uses demo data for analytics
- All features available in test mode

App designed to work with any Shopify store containing products for gift selection.
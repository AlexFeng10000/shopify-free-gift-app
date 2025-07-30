# Testing Instructions for Gift Booster App

## Quick Setup (2 minutes)

1. **Install app** on any Shopify development store
2. **Open app** from Apps section in Shopify admin
3. **Click "Manage Gift Tiers"** on main dashboard

## Create Multi-Tier Gift Strategy

### Step 1: Add First Tier
1. Click **"Add Tier"** button
2. Set **Threshold Amount**: `25`
3. Select **Gift Product**: Any low-value product from your store
4. Add **Description**: `Free sticker pack`
5. Ensure **"Active"** checkbox is checked

### Step 2: Add Second Tier  
1. Click **"Add Tier"** again
2. Set **Threshold Amount**: `50`
3. Select **Gift Product**: Different product
4. Add **Description**: `Free keychain`
5. Keep **"Active"** checked

### Step 3: Add Third Tier
1. Click **"Add Tier"** once more
2. Set **Threshold Amount**: `100`
3. Select **Gift Product**: Higher-value product
4. Add **Description**: `Premium tote bag`
5. Keep **"Active"** checked

### Step 4: Save Configuration
1. Click **"Save All Tiers"** button
2. Wait for success message
3. App redirects to dashboard automatically

## Test Core Functionality

### Verify Dashboard Display
- **Check**: All 3 tiers appear in "Gift Configuration" section
- **Verify**: Each tier shows correct threshold and status
- **Confirm**: "Gift Tiers Active" green banner displays

### Test Tier Management
1. Click **"Manage Gift Tiers"** again
2. **Edit** any tier threshold amount
3. **Toggle** a tier's active/inactive status
4. **Delete** and re-add a tier
5. **Save changes** and verify updates on dashboard

## Expected Behavior

### Multi-Tier Logic
- **$25 purchase**: Customer gets sticker pack only
- **$50 purchase**: Customer gets sticker pack + keychain
- **$100 purchase**: Customer gets all three gifts

### Analytics Dashboard
- **Displays**: Mock performance data (gifts added, conversion rates)
- **Shows**: Revenue impact metrics
- **Updates**: When tiers are modified

## Key Features to Verify

✅ **Unlimited Tiers**: Can add more than 3 tiers  
✅ **Progressive Rewards**: Higher tiers include lower-tier gifts  
✅ **Real-time Updates**: Dashboard reflects tier changes immediately  
✅ **Validation**: Prevents duplicate threshold amounts  
✅ **Sorting**: Automatically orders tiers by spending amount  
✅ **Mobile Responsive**: Interface works on mobile devices  

## Test Edge Cases

### Validation Testing
1. Try creating tiers with **same threshold** (should show error)
2. Set **threshold to 0** or negative (should show error)
3. Activate tier **without selecting product** (should show error)

### Data Persistence
1. **Refresh browser** - verify tiers remain saved
2. **Navigate away and back** - confirm data persists
3. **Clear and re-add** tiers - test full workflow

## No Additional Setup Required

- **No external accounts needed**
- **No API keys required**
- **Works immediately after installation**
- **Uses demo data for analytics**
- **All features available in test mode**

## Support

If any issues occur during testing:
- **Check browser console** for error messages
- **Verify Shopify store** has products available for gift selection
- **Refresh app** if interface doesn't load properly

The app is designed to work out-of-the-box with any Shopify store containing products.
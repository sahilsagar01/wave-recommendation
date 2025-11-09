# Testing the Drawer API

## Step 1: Check if Dev Server is Running

Make sure your dev server is running:
```bash
npm run dev
```

## Step 2: Test the API Endpoint Directly

Open your browser and visit (replace with your actual tunnel URL):
```
https://provided-boston-formed-numerical.trycloudflare.com/apps/wave/drawer?shop=YOUR_SHOP.myshopify.com
```

**Expected Response (if drawer is enabled):**
```json
{
  "enabled": true,
  "settings": {
    "shop": "your-shop.myshopify.com",
    "isEnabled": true,
    "position": "left",
    "width": 400,
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "closeButtonColor": "#000000",
    "showTriggerButton": true,
    "openOnCartClick": true
  },
  "announcements": [],
  "progressBars": [],
  "recommendationSettings": null
}
```

**Expected Response (if drawer is disabled):**
```json
{
  "enabled": false
}
```

**Expected Response (if MongoDB error):**
```json
{
  "error": "Failed to fetch drawer data"
}
```

## Step 3: Check MongoDB Connection

The drawer settings you saved should be in MongoDB. Check if MongoDB is accessible:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Navigate to your cluster
3. Click "Browse Collections"
4. Look for database: `wave`
5. Look for collection: `drawer_settings`
6. You should see a document with your shop domain

## Step 4: Test from Storefront

1. Open your storefront
2. Open browser console (F12)
3. Look for these logs:
   ```
   Fetching drawer data from: /apps/wave/drawer?shop=...
   Drawer data received: {enabled: true, settings: {...}}
   ```

## Step 5: Common Issues

### Issue: 404 Not Found on API

**Cause:** App proxy not configured

**Fix:**
```bash
npm run deploy
```

This configures the app proxy so `/apps/wave/drawer` routes to your app.

### Issue: "Shop parameter is required"

**Cause:** Shop domain not being passed

**Check:** The URL should include `?shop=your-shop.myshopify.com`

### Issue: MongoDB Connection Error

**Cause:** MongoDB string might be incorrect

**Fix:** Check `app/mongodb.server.ts` line 8:
```typescript
const MONGODB_URI = "mongodb+srv://java:gogomaster@database.qrvyh.mongodb.net/wave?retryWrites=true&w=majority";
```

### Issue: "enabled": false

**Cause:** Drawer is disabled in admin OR no settings found

**Fix:**
1. Go to admin → Drawer Settings
2. Check "Enable Drawer"
3. Click "Save Settings"
4. Refresh storefront

## Step 6: Force Test the Drawer

Add this to your browser console on the storefront:

```javascript
// Force open drawer
window.openWaveDrawer();

// Check if drawer data loaded
console.log('Drawer data:', window.drawerData);

// Manually fetch API
fetch('/apps/wave/drawer?shop=' + Shopify.shop)
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

## Debugging Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] App has been deployed (`npm run deploy`)
- [ ] Drawer is enabled in admin
- [ ] Settings were saved (check MongoDB Atlas)
- [ ] App proxy is configured in `shopify.app.toml`
- [ ] No errors in server console
- [ ] No errors in browser console
- [ ] API endpoint returns valid JSON

## Quick Fix Script

Run this in your terminal to check everything:

```bash
echo "=== Checking Configuration ==="
echo ""
echo "1. App Proxy Config:"
grep -A 3 "app_proxy" shopify.app.toml
echo ""
echo "2. API Route Exists:"
ls -la app/routes/apps.wave.drawer.tsx
echo ""
echo "3. MongoDB Connection:"
grep "MONGODB_URI" app/mongodb.server.ts
echo ""
echo "=== Next Steps ==="
echo "1. Make sure dev server is running: npm run dev"
echo "2. Deploy app: npm run deploy"
echo "3. Test API directly in browser"
echo "4. Check browser console on storefront"
```

## Manual Configuration Test

If the API works but drawer doesn't apply settings, the issue is in the JavaScript.

**Test in browser console:**
```javascript
// This should work if drawer code loaded
const drawer = document.getElementById('wave-drawer');
drawer.style.backgroundColor = '#fffffff'; // Test changing color
drawer.style.width = '500px'; // Test changing width
drawer.classList.remove('right');
drawer.classList.add('left'); // Test changing position
```

If these commands work, the issue is that `applyDrawerSettings()` isn't being called or settings object is wrong.

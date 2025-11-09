# Wave Drawer - Troubleshooting Guide

## Issue: Drawer Shows But No Content / Stuck UI

### Symptoms:
- Drawer opens but shows blank/white space
- No announcements, progress bars, or recommendations visible
- Cart items not showing
- Nothing happens when clicking buttons

### Root Cause:
The drawer JavaScript can't fetch configuration data from the app.

### Solutions:

#### 1. Check App Proxy Configuration

The app proxy needs to be configured for the drawer to fetch data from your store.

**Steps:**
1. Make sure `shopify.app.toml` has this section:
```toml
[app_proxy]
url = "https://your-app-url.com"
subpath = "wave"
prefix = "apps"
```

2. Deploy the app:
```bash
npm run deploy
```

3. The proxy should be automatically configured when you deploy.

#### 2. Check Browser Console for Errors

1. Open your storefront
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for error messages

**Common Errors:**

**Error:** `404 Not Found` on `/apps/wave/drawer`
- **Fix:** App proxy not configured. Run `npm run deploy` to set it up.

**Error:** `CORS error`
- **Fix:** The CORS headers are already configured in the API route.

**Error:** `Failed to fetch`
- **Fix:** App might not be running. Make sure `npm run dev` is active.

#### 3. Configure Drawer Settings in Admin

Even if the API is working, the drawer won't show content until you configure it:

1. Go to your app admin
2. Click "Drawer Settings"
3. Enable the drawer and configure at least one feature

**Minimum Configuration:**
- **Drawer Settings Tab:** Check "Enable Drawer"
- **Announcements Tab:** Add at least one announcement
- Save all changes

#### 4. Check MongoDB Connection

If nothing works, MongoDB might not be connected:

**Test:**
1. Open app admin at `/app/drawer`
2. Try to save drawer settings
3. If you see errors, check MongoDB connection string in `app/mongodb.server.ts`

#### 5. Verify Block is Added

1. Go to: Online Store → Themes → Customize
2. Click on a section (header or footer)
3. Look for "Wave Drawer" block under Apps
4. Make sure it's added to your theme

## Issue: Trigger Button Not Visible

### Solutions:

1. **Drawer is disabled:** Enable it in admin settings
2. **Block not added:** Add the Wave Drawer block to your theme
3. **CSS conflict:** Check browser console for styling errors

## Issue: Progress Bar Not Updating

### Solutions:

1. **Add items to cart:** Progress bar tracks cart value
2. **Check goal amount:** Make sure it's configured (e.g., $50 for free shipping)
3. **Enable progress bar:** Check admin → Progress Bar tab

## Issue: Recommendations Not Loading

### Solutions:

1. **Enable recommendations:** Admin → Recommendations tab → Check "Enable Recommendations"
2. **Check product count:** Your store needs products
3. **Shopify endpoint:** The drawer uses `/recommendations/products.json`
   - Some themes might not support this
   - Alternative: Use your existing product blocks instead

## Issue: Can't Save Settings in Admin

### Solutions:

1. **MongoDB connection:** Check connection string in `mongodb.server.ts`
2. **Network error:** Check browser console
3. **Authentication:** Make sure you're logged into the app

## Testing Checklist

Use this to verify everything is working:

- [ ] App is running (`npm run dev`)
- [ ] Extension deployed (`npm run deploy`)
- [ ] Block added to theme
- [ ] Drawer enabled in admin
- [ ] At least one announcement created
- [ ] Progress bar configured
- [ ] Recommendations enabled
- [ ] Trigger button visible on storefront
- [ ] Drawer opens when clicked
- [ ] Content displays correctly
- [ ] Close button works

## Debug Mode

To enable detailed logging, open browser console and run:

```javascript
localStorage.setItem('waveDrawerDebug', 'true');
```

Then refresh the page. You'll see detailed logs about:
- API calls
- Data received
- Rendering steps
- Errors

To disable:
```javascript
localStorage.removeItem('waveDrawerDebug');
```

## Quick Fixes

### Reset Everything

If things are completely broken:

1. **Clear browser cache and cookies**
2. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
3. **Redeploy:**
   ```bash
   npm run deploy
   ```
4. **Remove and re-add block** in theme customizer

### Show Default Content

If you just want to test the drawer UI without configuration:

The drawer will automatically show a "Welcome" message if it can't fetch configuration. This is normal and means the drawer is working, just not configured yet.

## Common Questions

**Q: Why is my drawer empty?**
A: You haven't configured any content yet. Go to admin and set up announcements/progress bars.

**Q: Can I test without MongoDB?**
A: No, MongoDB stores all configuration. But the connection is already set up - just configure content in admin.

**Q: Do I need to deploy for every change?**
A: No! Only deploy when:
- First time setup
- Changing extension structure
- Updating app proxy

For admin configuration changes, just save in the admin panel.

**Q: How do I know if the API is working?**
A: Open browser console and look for:
```
Fetching drawer data from: /apps/wave/drawer?shop=...
Drawer data received: {enabled: true, ...}
```

If you see errors instead, check the troubleshooting steps above.

## Still Having Issues?

1. Check all files are created (see `IMPLEMENTATION_CHECKLIST.md`)
2. Verify MongoDB connection string is correct
3. Make sure app is running (`npm run dev`)
4. Check browser console for specific errors
5. Review the console logs shown above

## Contact Support

If you've tried everything above and still having issues:

1. Share the browser console error messages
2. Check MongoDB Atlas - is the database accessible?
3. Verify the app proxy is working: Visit `/apps/wave/drawer?shop=YOUR_SHOP.myshopify.com` directly
4. Make sure all files from `IMPLEMENTATION_CHECKLIST.md` exist

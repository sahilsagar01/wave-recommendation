# Wave Drawer - Cart Integration Guide

## Overview

The Wave Drawer now opens when customers click the cart button/icon instead of navigating to the cart page. This creates a seamless shopping experience with announcements, cart progress, and product recommendations.

## Features

### ✅ Auto-detect Cart Buttons
The drawer automatically detects and attaches to cart buttons using common Shopify selectors:
- Standard cart links (`a[href="/cart"]`)
- Cart icons (`.cart-icon`, `.header__icon--cart`)
- Theme-specific elements (`#cart-icon-bubble`)
- ARIA labeled cart buttons

### ✅ Admin Controls
Two new settings in **Drawer Settings** tab:

1. **Show Floating Trigger Button**
   - Controls the floating button in the bottom right
   - Can be disabled if you only want cart button to trigger drawer

2. **Open Drawer on Cart Click**
   - When enabled: Cart button opens the drawer
   - When disabled: Cart button works normally (goes to cart page)

## How It Works

### 1. Cart Button Detection
```javascript
// The drawer searches for cart buttons using multiple selectors
const cartSelectors = [
  'a[href="/cart"]',
  '.cart-icon',
  '.header__icon--cart',
  // ... and 10+ more common patterns
];
```

### 2. Event Hijacking
When enabled, the drawer:
- Prevents default cart page navigation
- Opens the drawer instead
- Updates cart totals automatically
- Shows progress bars based on cart value

### 3. Browser Console Logging
Check the console to see how many cart buttons were detected:
```
Wave Drawer: Event listeners attached to 2 cart button(s)
```

## Configuration

### Enable Cart Integration

1. Go to your app admin
2. Click **Drawer Settings**
3. Check **"Open Drawer on Cart Click"**
4. Save settings

### Disable Floating Button (Optional)

If you want ONLY the cart button to open the drawer:

1. In **Drawer Settings**
2. Uncheck **"Show Floating Trigger Button"**
3. Keep **"Open Drawer on Cart Click"** checked
4. Save settings

## What Customers See

### Before (Default Cart):
1. Customer clicks cart icon
2. Navigates to `/cart` page
3. Sees basic cart items

### After (With Drawer):
1. Customer clicks cart icon
2. Drawer slides in from side
3. Sees:
   - Announcements (e.g., "Free shipping at $50!")
   - Progress bar showing how close to free shipping
   - Current cart items
   - Product recommendations
   - Easy add-to-cart for recommended products

## Testing

### 1. Check Cart Button Detection

Open browser console (F12) and look for:
```
Wave Drawer: Event listeners attached to X cart button(s)
```

If you see `0 cart button(s)`, your theme uses a custom cart selector.

### 2. Test Cart Click

1. Click the cart icon in your header
2. Drawer should slide in
3. Cart should NOT navigate to `/cart` page

### 3. Verify Settings

- Try toggling "Open Drawer on Cart Click" on/off
- Refresh the page after each change
- Test cart button behavior

## Troubleshooting

### Cart Button Doesn't Open Drawer

**Problem:** Clicking cart still goes to cart page

**Solutions:**

1. **Check setting is enabled:**
   - Admin → Drawer Settings
   - "Open Drawer on Cart Click" must be checked

2. **Check console for errors:**
   - Open browser console (F12)
   - Look for error messages

3. **Theme uses custom selector:**
   - Check the HTML of your cart button
   - Share the selector and we can add it

### Drawer Opens But Shows No Cart Items

**Problem:** Drawer opens but cart section is empty

**Solution:**
- The drawer doesn't show cart items by default
- It shows: announcements, progress bars, and recommendations
- To show cart items, you would need to add that feature

### Multiple Triggers

**Problem:** Both floating button AND cart button trigger drawer

**This is normal!** You can:
- Hide the floating button: Uncheck "Show Floating Trigger Button"
- Keep both: Some users might prefer one over the other

### Drawer Opens on Every Cart Click

**Problem:** Want to let users access cart page sometimes

**Solution:**
Currently, when enabled, ALL cart clicks open the drawer. Future enhancement:
- Add a "View Full Cart" button inside the drawer
- Link to `/cart` page for users who want the full experience

## Custom Theme Integration

If your theme uses a unique cart button selector, you can:

### Option 1: Let Us Know
Share your theme's cart button HTML/selector and we'll add it to the default list.

### Option 2: Manual Trigger
Add this to your theme's cart button:
```liquid
<button onclick="window.openWaveDrawer()">Cart</button>
```

### Option 3: Custom JavaScript
Add to your theme's custom JavaScript:
```javascript
document.querySelector('.your-custom-cart-selector').addEventListener('click', function(e) {
  e.preventDefault();
  window.openWaveDrawer();
});
```

## Advanced Usage

### Programmatically Open/Close Drawer

The drawer exposes global functions:

```javascript
// Open the drawer
window.openWaveDrawer();

// Close the drawer
window.closeWaveDrawer();
```

**Use cases:**
- Open drawer after adding product to cart
- Open drawer from custom buttons
- Close drawer programmatically

### Example: Open After Add to Cart
```javascript
// In your theme's add to cart success handler
fetch('/cart/add.js', {
  method: 'POST',
  body: JSON.stringify({ id: variantId, quantity: 1 })
})
.then(response => response.json())
.then(data => {
  window.openWaveDrawer(); // Open drawer after adding to cart
});
```

## Best Practices

### 1. Configure Progress Bars
Set up cart progress bars to encourage higher cart values:
- **Goal:** $50
- **Text:** "Free Shipping!"
- **Color:** Green (#10b981)

### 2. Add Relevant Announcements
- "Free shipping on orders over $50"
- "Add $X more for free shipping"
- Limited time offers

### 3. Enable Recommendations
Show related products in the drawer to increase average order value.

### 4. Test on Mobile
Most cart clicks happen on mobile. Test the drawer:
- Opens smoothly
- Closes easily
- Content is readable
- Buttons are touch-friendly

## Future Enhancements

Potential features for future updates:

- [ ] Show actual cart items in drawer
- [ ] Quick quantity update in drawer
- [ ] Remove items from drawer
- [ ] Apply discount codes
- [ ] Checkout button in drawer
- [ ] Mini cart vs full drawer toggle
- [ ] Slide-out animation options
- [ ] Custom trigger button placement

## Summary

The cart integration provides a modern, app-like shopping experience:

✅ Faster than navigating to cart page
✅ Shows helpful information (progress, announcements)
✅ Recommends related products
✅ Fully customizable via admin
✅ Works with most Shopify themes

Configure it once in the admin, and it works automatically on your storefront!

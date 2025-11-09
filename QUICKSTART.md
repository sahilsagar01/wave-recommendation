# Wave Drawer - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Deploy the Extension (Required First!)

```bash
npm run deploy
```

⚠️ **Important**:
- Do NOT use the `--force` flag
- Follow the interactive prompts
- Map your extensions when asked
- This fixes the UID error you encountered

### Step 2: Add the Drawer Block to Your Theme

1. Go to your Shopify admin
2. Click **Online Store** → **Themes**
3. Click **Customize** on your active theme
4. Click **Add block** or **Add section** (depending on where you want it)
5. Under **Apps**, find **"Wave Drawer"**
6. Add it to your theme (recommended: add to a section that appears on all pages)
7. Click **Save** in the top right

**Note:** The drawer will appear as a floating button on your storefront once configured.

### Step 3: Configure Your Drawer

1. Open your Shopify app admin panel
2. Click **"Drawer Settings"** in the navigation
3. Go through each tab:

#### Tab 1: Drawer Settings
- ✅ Check "Enable Drawer"
- Choose position: Right (recommended)
- Set width: 400px (recommended)
- Customize colors to match your theme

#### Tab 2: Announcements
- Click **"Add Announcement"**
- Example:
  - Title: "Free Shipping!"
  - Message: "Get free shipping on orders over $50"
  - Background: #10b981 (green)
  - Text: #ffffff (white)

#### Tab 3: Progress Bar
- Click **"Add Progress Bar"**
- Example:
  - Title: "You're almost there!"
  - Goal Amount: 50
  - Goal Text: "Free Shipping"
  - Progress Color: #10b981 (green)

#### Tab 4: Recommendations
- ✅ Check "Enable Recommendations"
- Title: "You might also like"
- Number of Products: 4
- Layout: Grid
- Customize colors to match your theme

### Step 4: Test It!

1. Visit your storefront
2. You should see a floating button (☰) in the bottom right
3. Click it to open the drawer
4. You should see:
   - Your announcement at the top
   - Progress bar showing cart progress
   - Product recommendations at the bottom

## 🎨 Customization Tips

### Color Schemes

**Dark Theme**:
- Drawer Background: `#1f2937`
- Text Color: `#ffffff`
- Progress Color: `#10b981`

**Light Theme** (Default):
- Drawer Background: `#ffffff`
- Text Color: `#000000`
- Progress Color: `#3b82f6`

**Accent Colors**:
- Green: `#10b981` (success, shipping)
- Blue: `#3b82f6` (info)
- Red: `#ef4444` (urgent)
- Yellow: `#f59e0b` (warning)

### Progress Bar Ideas

1. **Free Shipping Threshold**
   - Goal: $50
   - Text: "Free Shipping!"

2. **Discount Unlock**
   - Goal: $100
   - Text: "Unlock 10% Off"

3. **Gift with Purchase**
   - Goal: $75
   - Text: "Free Gift"

### Announcement Ideas

1. **Promotion**: "Summer Sale - 20% Off Everything!"
2. **Shipping**: "Free shipping on orders over $50"
3. **New Arrivals**: "New collection just dropped!"
4. **Limited Time**: "Flash Sale - Ends Tonight!"

## 🔧 Troubleshooting

### "Extension needs UID" Error
```bash
npm run deploy
# Follow the prompts - don't use --force
```

### Drawer Not Visible
1. ✅ Check: Drawer enabled in admin settings?
2. ✅ Check: App embed enabled in theme?
3. ✅ Check: Browser console for errors (F12)

### Progress Bar Shows $0.00
- The progress bar reads from the current cart
- Add items to cart to see it update

### Recommendations Not Showing
- Ensure your store has products
- Check that "Enable Recommendations" is checked
- Try reducing the number of products

### Styling Issues
- All colors are in hex format: `#000000`
- Widths are in pixels (numbers only): `400`
- Refresh the storefront after saving changes

## 📱 Mobile Optimization

The drawer is fully responsive:
- On mobile, drawer takes full width
- Touch-friendly close button
- Smooth slide-in animation
- Scrollable content area

## 🎯 Best Practices

1. **Keep Announcements Short**: 1-2 sentences max
2. **Use Clear Goals**: Round numbers ($50, $100)
3. **Limit Progress Bars**: 1-2 maximum for clarity
4. **Optimize Images**: Recommendations load product images
5. **Test on Mobile**: Most customers shop on mobile

## 📊 Data Management

All settings are stored in MongoDB:
- Each shop has isolated data
- Settings persist across sessions
- Updates are instant
- No data lost on app restart

## 🔒 Security

- Admin APIs require Shopify authentication
- Public API only returns enabled items
- Shop domain isolation prevents data leakage
- CORS configured for safe storefront access

## 📈 Next Steps

After basic setup:
1. Add multiple announcements for different promotions
2. Create progress bars for different goals
3. Customize colors to match your brand
4. Monitor customer engagement
5. Adjust settings based on performance

## 💡 Pro Tips

- **Order Matters**: Announcements and progress bars have an "order" field for custom sorting
- **Multiple Progress Bars**: Create different bars for different goals
- **Link Announcements**: Add links to collection pages or products
- **A/B Testing**: Try different colors and messaging
- **Seasonal Updates**: Update announcements for holidays and sales

## 📞 Need Help?

Check these files for detailed info:
- `DRAWER_SETUP.md` - Full setup guide
- `DRAWER_ARCHITECTURE.md` - Technical documentation

Happy selling! 🎉

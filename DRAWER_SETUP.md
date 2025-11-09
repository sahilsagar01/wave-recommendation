# Wave Drawer - Setup and Usage Guide

## Overview

The Wave Drawer is a comprehensive Shopify app embed that displays announcements, cart progress bars, and product recommendations in a customizable side drawer.

## Features

✅ **Customizable Drawer**
- Position (left/right)
- Width, colors, and styling
- Enable/disable toggle

✅ **Announcements**
- Multiple announcements support
- Custom styling per announcement
- Optional links
- Order management

✅ **Cart Progress Bar**
- Track cart value towards goals (e.g., free shipping)
- Customizable colors and styling
- Show/hide percentage and amount
- Multiple progress bars support

✅ **Product Recommendations**
- Grid or list layout
- Configurable number of products
- Customizable card styling
- Add to cart functionality

## Database Setup

The app uses MongoDB for storing drawer configurations. The connection is already configured with:

```
mongodb+srv://java:gogomaster@database.qrvyh.mongodb.net/wave?retryWrites=true&w=majority
```

### Collections Created

1. `drawer_settings` - Main drawer configuration
2. `announcements` - Announcement content and styling
3. `progress_bars` - Progress bar configurations
4. `recommendation_settings` - Product recommendation settings

## Installation Steps

### 1. Deploy the App Extension

First, you need to deploy the app to map the extension UIDs:

```bash
npm run deploy
```

**Important**: Run this command **without** the `--force` flag and follow the interactive prompts to map your extensions.

### 2. Add the Drawer Block to Your Theme

1. Go to your Shopify store admin
2. Navigate to **Online Store > Themes**
3. Click **Customize** on your active theme
4. In the theme editor, click **Add block** or **Add section**
5. Under **Apps**, find **"Wave Drawer"**
6. Add it to your theme (recommended: add to the footer or header section so it appears on all pages)
7. Click **Save**

**Note:** The Wave Drawer block renders a snippet that displays the drawer globally on your store.

### 3. Configure the Drawer

1. Open your Shopify app admin
2. Navigate to **Drawer Settings** from the app navigation
3. Configure each section:

#### Drawer Settings Tab
- Enable the drawer
- Choose position (left/right)
- Set width (recommended: 400px)
- Customize colors

#### Announcements Tab
- Click "Add Announcement"
- Set title, message, and styling
- Optionally add a link
- Create multiple announcements if needed

#### Progress Bar Tab
- Click "Add Progress Bar"
- Set goal amount (e.g., $100 for free shipping)
- Customize text, colors, and display options
- Create multiple progress bars for different goals

#### Recommendations Tab
- Enable recommendations
- Set the number of products to show
- Choose layout (grid/list)
- Customize card styling and colors

## File Structure

```
app/
├── mongodb.server.ts                      # MongoDB connection
├── types/drawer.types.ts                  # TypeScript types
└── routes/
    ├── app.drawer.tsx                     # Admin UI
    ├── api.drawer.settings.tsx            # Drawer settings API
    ├── api.drawer.announcement.tsx        # Announcements API
    ├── api.drawer.progressbar.tsx         # Progress bar API
    ├── api.drawer.recommendation.tsx      # Recommendations API
    └── api.drawer.public.tsx              # Public storefront API

extensions/wave-theme-extention/
├── blocks/
│   └── drawer.liquid                      # Theme block
└── snippets/
    └── wave-drawer.liquid                 # Drawer snippet
```

## API Endpoints

### Admin Endpoints (Authenticated)

- `GET/POST /api/drawer/settings` - Drawer configuration
- `GET/POST /api/drawer/announcement` - Manage announcements
- `GET/POST /api/drawer/progressbar` - Manage progress bars
- `GET/POST /api/drawer/recommendation` - Recommendation settings

### Public Endpoint (CORS Enabled)

- `GET /api/drawer/public?shop={shop_domain}` - Fetch drawer data for storefront

## Customization

### Styling

All styling can be customized through the admin interface. The drawer uses inline styles for maximum compatibility with different themes.

### Adding Custom Features

To add new features to the drawer:

1. Create a new collection in MongoDB
2. Add API endpoints in `app/routes/`
3. Update the admin UI in `app.drawer.tsx`
4. Modify the `drawer.liquid` file to render the new feature

## Troubleshooting

### Extension UID Error

If you see an error about extensions needing UIDs:
```bash
npm run deploy
```
Follow the interactive prompts (don't use `--force`).

### Drawer Not Showing

1. Check that the drawer is enabled in Drawer Settings
2. Verify the app embed is enabled in the theme editor
3. Check browser console for errors
4. Ensure MongoDB connection is working

### Recommendations Not Loading

The drawer uses Shopify's built-in `/recommendations/products.json` endpoint. Ensure:
- Your store has products
- The endpoint is accessible on your theme
- The number of products doesn't exceed available products

## Development

### Running Locally

```bash
npm run dev
```

### Testing the Drawer

1. Use the Shopify CLI development store
2. Enable the app embed in the theme customizer
3. Configure settings in the admin
4. Visit the storefront to see the drawer

## MongoDB Schema Examples

### Drawer Settings
```json
{
  "shop": "example.myshopify.com",
  "isEnabled": true,
  "position": "right",
  "width": 400,
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "closeButtonColor": "#000000"
}
```

### Announcement
```json
{
  "shop": "example.myshopify.com",
  "isEnabled": true,
  "title": "Free Shipping!",
  "message": "Get free shipping on orders over $50",
  "backgroundColor": "#f3f4f6",
  "textColor": "#000000",
  "fontSize": 14,
  "link": "/collections/all",
  "linkText": "Shop Now",
  "order": 0
}
```

### Progress Bar
```json
{
  "shop": "example.myshopify.com",
  "isEnabled": true,
  "title": "Cart Progress",
  "goalAmount": 100,
  "goalText": "Free Shipping",
  "backgroundColor": "#e5e7eb",
  "progressColor": "#10b981",
  "textColor": "#000000",
  "showPercentage": true,
  "showAmount": true,
  "height": 20,
  "borderRadius": 10,
  "order": 0
}
```

## Support

For issues or questions, please check:
1. MongoDB connection is active
2. App permissions are correct
3. Theme is compatible with app embeds
4. Browser console for JavaScript errors

## Future Enhancements

Potential features to add:
- Drawer open/close animations
- Trigger button customization
- Multiple trigger options (cart icon, custom button)
- Customer segmentation for announcements
- A/B testing for different configurations
- Analytics tracking

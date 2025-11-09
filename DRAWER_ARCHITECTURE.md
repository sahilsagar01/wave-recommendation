# Wave Drawer - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SHOPIFY STOREFRONT                          │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │              drawer.liquid (App Embed)                    │    │
│  │  - Drawer UI with overlay                                 │    │
│  │  - Floating trigger button                                │    │
│  │  - Fetches data from public API                           │    │
│  │  - Renders announcements, progress, recommendations       │    │
│  └────────────────────┬──────────────────────────────────────┘    │
│                       │                                             │
└───────────────────────┼─────────────────────────────────────────────┘
                        │
                        │ GET /api/drawer/public?shop={shop}
                        │ (CORS enabled)
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SHOPIFY APP (Remix)                            │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    Public API Layer                         │  │
│  │  api.drawer.public.tsx                                      │  │
│  │  - Fetches drawer settings                                  │  │
│  │  - Fetches enabled announcements                            │  │
│  │  - Fetches enabled progress bars                            │  │
│  │  - Fetches recommendation settings                          │  │
│  └─────────────────────┬───────────────────────────────────────┘  │
│                        │                                            │
│  ┌─────────────────────┴───────────────────────────────────────┐  │
│  │                 Admin API Layer (Auth Required)             │  │
│  │                                                             │  │
│  │  api.drawer.settings.tsx      - GET/POST drawer config     │  │
│  │  api.drawer.announcement.tsx  - CRUD announcements         │  │
│  │  api.drawer.progressbar.tsx   - CRUD progress bars         │  │
│  │  api.drawer.recommendation.tsx - GET/POST recommendations  │  │
│  └─────────────────────┬───────────────────────────────────────┘  │
│                        │                                            │
│  ┌─────────────────────┴───────────────────────────────────────┐  │
│  │                    Admin UI Layer                           │  │
│  │  app.drawer.tsx                                             │  │
│  │                                                             │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │  │
│  │  │   Drawer     │ │ Announcement │ │  Progress    │       │  │
│  │  │   Settings   │ │   Manager    │ │     Bar      │       │  │
│  │  │              │ │              │ │   Manager    │       │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │  │
│  │  ┌──────────────┐                                          │  │
│  │  │Recommendation│                                          │  │
│  │  │   Settings   │                                          │  │
│  │  └──────────────┘                                          │  │
│  └─────────────────────┬───────────────────────────────────────┘  │
│                        │                                            │
│  ┌─────────────────────┴───────────────────────────────────────┐  │
│  │                MongoDB Connection Layer                     │  │
│  │  mongodb.server.ts                                          │  │
│  │  - Connection pooling                                       │  │
│  │  - Collection helpers                                       │  │
│  └─────────────────────┬───────────────────────────────────────┘  │
│                        │                                            │
└────────────────────────┼────────────────────────────────────────────┘
                         │
                         │ MongoDB Driver
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas Database                           │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐                       │
│  │ drawer_settings  │  │  announcements   │                       │
│  │                  │  │                  │                       │
│  │ - shop           │  │ - shop           │                       │
│  │ - isEnabled      │  │ - isEnabled      │                       │
│  │ - position       │  │ - title          │                       │
│  │ - width          │  │ - message        │                       │
│  │ - colors         │  │ - colors/fonts   │                       │
│  └──────────────────┘  └──────────────────┘                       │
│                                                                     │
│  ┌──────────────────┐  ┌─────────────────────────┐               │
│  │  progress_bars   │  │ recommendation_settings │               │
│  │                  │  │                         │               │
│  │ - shop           │  │ - shop                  │               │
│  │ - isEnabled      │  │ - isEnabled             │               │
│  │ - goalAmount     │  │ - numberOfProducts      │               │
│  │ - goalText       │  │ - layout                │               │
│  │ - colors         │  │ - styling options       │               │
│  └──────────────────┘  └─────────────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Admin Configuration Flow
```
1. Admin opens /app/drawer
2. Selects a tab (Settings/Announcements/Progress/Recommendations)
3. Modifies settings and clicks "Save"
4. Form data sent to corresponding API endpoint
5. API validates and stores in MongoDB
6. Success message displayed to admin
```

### Storefront Display Flow
```
1. Customer visits store (drawer.liquid loads)
2. JavaScript fetches /api/drawer/public?shop={shop}
3. API queries MongoDB for all enabled settings
4. Returns combined JSON response
5. JavaScript renders drawer based on settings:
   - Applies drawer styling (position, colors, width)
   - Renders announcements in order
   - Renders progress bars with cart calculation
   - Loads and displays product recommendations
6. Drawer opens when trigger button is clicked
```

### Cart Progress Calculation
```
1. drawer.liquid fetches current cart via /cart.js
2. Calculates progress: (cartTotal / goalAmount) * 100
3. Updates progress bar fill width
4. Shows remaining amount: goalAmount - cartTotal
5. Re-calculates on cart updates (listening to cart:updated event)
```

## Component Breakdown

### Admin Interface Components

#### DrawerSettings Component
- Controls: Checkbox (enable), Select (position), TextField (width, colors)
- Saves to: `drawer_settings` collection
- Fields: isEnabled, position, width, backgroundColor, textColor, closeButtonColor

#### AnnouncementManager Component
- Features: DataTable list, Modal for create/edit, Delete functionality
- Saves to: `announcements` collection
- Fields: isEnabled, title, message, backgroundColor, textColor, fontSize, link, linkText, order

#### ProgressBarManager Component
- Features: DataTable list, Modal for create/edit, Delete functionality
- Saves to: `progress_bars` collection
- Fields: isEnabled, title, goalAmount, goalText, backgroundColor, progressColor, textColor, showPercentage, showAmount, height, borderRadius, order

#### RecommendationSettings Component
- Controls: Multiple TextFields, Checkboxes, Select
- Saves to: `recommendation_settings` collection
- Fields: isEnabled, title, numberOfProducts, layout, showPrice, showAddToCart, styling options

### Storefront Components

#### Drawer Structure
```html
<div id="wave-drawer-overlay"> <!-- Dark overlay -->
<div id="wave-drawer">         <!-- Sliding drawer -->
  <div class="wave-drawer-header">
    <h2>Menu</h2>
    <button class="wave-drawer-close">×</button>
  </div>
  <div class="wave-drawer-content">
    <!-- Announcements -->
    <!-- Progress Bars -->
    <!-- Recommendations -->
  </div>
</div>
<button class="wave-drawer-trigger"> <!-- Floating button -->
```

## API Reference

### Admin APIs (Authenticated)

#### GET/POST /api/drawer/settings
**Auth**: Required (Shopify Admin)
**GET**: Returns current drawer settings
**POST**: Updates drawer settings
```json
{
  "action": "update",
  "isEnabled": true,
  "position": "right",
  "width": 400,
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "closeButtonColor": "#000000"
}
```

#### GET/POST /api/drawer/announcement
**Auth**: Required (Shopify Admin)
**GET**: Returns all announcements for shop
**POST Actions**:
- `create`: Add new announcement
- `update`: Modify existing (requires id)
- `delete`: Remove announcement (requires id)

#### GET/POST /api/drawer/progressbar
**Auth**: Required (Shopify Admin)
**GET**: Returns all progress bars for shop
**POST Actions**: Same as announcements

#### GET/POST /api/drawer/recommendation
**Auth**: Required (Shopify Admin)
**GET**: Returns recommendation settings
**POST**: Updates recommendation settings

### Public API

#### GET /api/drawer/public
**Auth**: None (CORS enabled)
**Query Params**: `shop` (required)
**Response**:
```json
{
  "enabled": true,
  "settings": { /* drawer settings */ },
  "announcements": [ /* enabled announcements */ ],
  "progressBars": [ /* enabled progress bars */ ],
  "recommendationSettings": { /* recommendation config */ }
}
```

## Security Considerations

1. **Admin APIs**: All admin endpoints require Shopify authentication via `authenticate.admin(request)`
2. **Public API**: CORS headers allow cross-origin requests from storefronts
3. **Shop Isolation**: All queries filter by shop domain to prevent data leakage
4. **MongoDB**: Connection string should be moved to environment variables in production

## Performance Optimizations

1. **Connection Pooling**: MongoDB client reuses connections
2. **Parallel Queries**: Public API uses Promise.all() to fetch data concurrently
3. **Selective Loading**: Only enabled items are returned to storefront
4. **Order Management**: Announcements and progress bars support ordering for efficient display

## Type Safety

TypeScript types defined in `app/types/drawer.types.ts`:
- `DrawerSettings`
- `Announcement`
- `ProgressBar`
- `RecommendationSettings`

All types include optional `_id` for MongoDB documents and required `shop` field for multi-tenancy.

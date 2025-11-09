/**
 * Test script for Wave Drawer API
 * Run this with: node test-drawer-api.js
 */

const shopDomain = process.argv[2] || 'your-shop.myshopify.com';
const apiUrl = `http://localhost:3000/apps/wave/drawer?shop=${shopDomain}`;

console.log('==========================================');
console.log('Wave Drawer API Test');
console.log('==========================================\n');

console.log(`Testing API endpoint: ${apiUrl}\n`);

fetch(apiUrl)
  .then(response => {
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, response.headers.raw());
    return response.json();
  })
  .then(data => {
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(data, null, 2));

    if (data.enabled) {
      console.log('\n✅ Drawer is ENABLED');
      console.log('\nSettings found:');
      console.log('  - Position:', data.settings?.position || 'Not set');
      console.log('  - Width:', data.settings?.width || 'Not set');
      console.log('  - Background:', data.settings?.backgroundColor || 'Not set');
      console.log('  - Show Trigger Button:', data.settings?.showTriggerButton);
      console.log('  - Open on Cart Click:', data.settings?.openOnCartClick);
      console.log('\n  - Announcements:', data.announcements?.length || 0);
      console.log('  - Progress Bars:', data.progressBars?.length || 0);
      console.log('  - Recommendations:', data.recommendationSettings?.isEnabled ? 'Enabled' : 'Disabled');
    } else {
      console.log('\n❌ Drawer is DISABLED or not configured');
      console.log('Go to admin and enable the drawer');
    }
  })
  .catch(error => {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Make sure dev server is running: npm run dev');
    console.error('  2. Check if MongoDB is accessible');
    console.error('  3. Run: npm run deploy');
  });

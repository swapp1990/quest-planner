# CLAUDE.md - React Native iOS App

## Project Overview
React Native app built with Expo SDK 54 for iOS development.

## Requirements
- Node.js 20+ (use `nvm use 20` before running commands)
- EAS CLI (`npm install -g eas-cli`)
- Apple Developer account (for device builds)

## First-Time Setup
```bash
# Switch to Node 20
nvm use 20

# Build for iOS device (interactive - sets up Apple credentials)
cd HelloWorld && eas build --profile development --platform ios
```

## Development Commands
```bash
# Start Metro bundler (after installing dev build on device)
npx expo start --dev-client

# Start with tunnel (if local network connection fails)
npx expo start --dev-client --tunnel
```

## Build Commands
```bash
# Development build - supports hot reload
eas build --profile development --platform ios

# Preview build - internal testing
eas build --profile preview --platform ios

# Production build - App Store
eas build --profile production --platform ios
```

## Key Files
- `App.js` - Main app component
- `app.json` - Expo config (bundleId, splash, etc.)
- `eas.json` - Build profiles
- `src/theme/index.js` - Design tokens (colors, spacing, typography)
- `src/components/` - Reusable UI components
- `src/auth/` - Authentication (AuthContext, useGoogleAuth)
- `src/purchases/` - In-app purchases (RevenueCat)

## UI Components
All components in `src/components/`:
- **Button** - Primary, secondary, outline, ghost variants; sm/md/lg sizes; loading state
- **Card** - Elevated, outlined, filled variants; optional onPress
- **Input** - Label, placeholder, error state, helper text, icons
- **Typography** - H1, H2, H3, Body, BodySmall, Caption
- **Avatar** - Image or initials; xs/sm/md/lg/xl sizes
- **Badge** - Primary, secondary, success, warning, error, info variants
- **Divider** - Horizontal separator with spacing options

## Theme System
Design tokens in `src/theme/index.js`:
- `colors` - Primary (indigo), secondary (pink), semantic colors
- `spacing` - xs(4), sm(8), md(16), lg(24), xl(32), xxl(48)
- `borderRadius` - sm(6), md(12), lg(16), xl(24), full(9999)
- `typography` - Font sizes and weights for each text style
- `shadows` - sm, md, lg elevation styles

## Development Workflow
1. Run `eas build --profile development --platform ios`
2. Install build on device via QR code link
3. Run `npx expo start --dev-client`
4. Open app on device - it connects to Metro
5. Edit code - changes auto-reload

## iOS Config
- Bundle ID: `com.swapnilsawant.helloworld`
- EAS Project: `@swapp1990/HelloWorld`

## In-App Purchases (RevenueCat)
Files in `src/purchases/`:
- `config.js` - API key, entitlement IDs, product IDs
- `PurchasesContext.js` - Provider and usePurchases hook
- `usePurchaseActions.js` - Purchase/restore actions

**Setup Required:**
1. Create RevenueCat account at https://app.revenuecat.com
2. Add iOS app with bundle ID `com.swapnilsawant.helloworld`
3. Get Public SDK Key (starts with `appl_`) and update `config.js`
4. Create entitlement "premium" and configure offerings
5. Create products in App Store Connect and link to RevenueCat

**Usage:**
```javascript
import { usePurchases, usePurchaseActions } from '../purchases';

// Check premium status
const { isPremium } = usePurchases();

// Purchase actions
const { handlePurchase, handleRestore, getPackages } = usePurchaseActions();
```

## Troubleshooting
- Hot reload stopped: Shake device > "Reload"
- Connection fails: Use `--tunnel` flag
- Clear cache: `npx expo start --clear`
- Native module errors: Run `eas build --profile development --platform ios`

# Technical Documentation — Quest Planner

This document describes the tech stack, architecture, and RevenueCat implementation.

## Tech Stack

- **React Native** `0.81.5` + **React** `19.1.0`
- **Expo SDK** `54` (iOS-focused)
- **Navigation:** `@react-navigation/native` + native stack + bottom tabs
- **Persistence:** `@react-native-async-storage/async-storage`
- **UX:** `expo-haptics`, `expo-linear-gradient`, `react-native-svg`
- **Monetization:** **RevenueCat** via `react-native-purchases` `^9.7.6`

## Architecture Overview

Quest Planner is organized as feature modules under `src/`:

- `src/campaign/`: campaign templates + campaign engine + persistence
- `src/navigation/`: a reducer-driven navigation state machine
- `src/screens/`: screens/modals (campaign flow, paywall)
- `src/components/` + `src/theme/`: UI system + design tokens
- `src/purchases/`: RevenueCat configuration + provider + actions

### Campaign engine (data-driven)

Campaign content lives in `src/campaign/soloTripData.js` as a template:

- Campaign → Chapters (Acts) → Quests
- Each quest can have `maxSegments` so completion can be incremental

Runtime campaign state is created via `initializeCampaign(...)` and saved to AsyncStorage by `src/campaign/CampaignContext.js`.

### Navigation (state machine)

Instead of pushing arbitrary screens, the app uses a reducer (`src/navigation/`) to drive a predictable journey:

Select → Intro → Briefing → Home → Chapter → (back)

This is useful for hackathon speed because the flow stays consistent even as content changes.

## RevenueCat Implementation

### Files

- `src/purchases/config.js`: API key, entitlement IDs, product IDs
- `src/purchases/PurchasesContext.js`: `PurchasesProvider` + `usePurchases`
- `src/purchases/usePurchaseActions.js`: `handlePurchase`, `handleRestore`, package helpers
- `src/screens/PaywallScreen.js`: paywall UI that lists packages from offerings
- `App.js`: wraps the app with `<PurchasesProvider>` so purchase state is global

### Initialization flow

On app startup, `PurchasesProvider`:

1. Calls `Purchases.configure({ apiKey })`
2. Fetches offerings: `Purchases.getOfferings()`
3. Fetches customer info: `Purchases.getCustomerInfo()`
4. Subscribes to updates with `Purchases.addCustomerInfoUpdateListener(...)`

Premium state is derived from active entitlements:

- If `entitlements.active.premium` exists, the user is Premium.

### Paywall flow

`src/screens/PaywallScreen.js` pulls packages from:

- `offerings.current.availablePackages`

When a user taps subscribe:

- `Purchases.purchasePackage(pkg)` runs in `purchasePackage(...)`
- Premium state updates automatically from the customer info listener

Restore:

- `Purchases.restorePurchases()` updates customer info and Premium state

### Dashboard configuration (expected)

To match the code defaults:

- Entitlement ID: `premium`
- Offering identifier: “current” offering in RevenueCat (shown as `offerings.current`)
- Products in App Store Connect:
  - `questplanner_monthly`
  - `questplanner_yearly`

### Premium gating strategy (product-level)

Quest Planner’s Premium is intended to gate **additional campaign packs** (e.g., creator-aligned travel journeys) rather than blocking the core “Solo Trip” loop. The app already exposes:

- a global `isPremium` flag from `usePurchases()`
- a dedicated `PaywallScreen` that can be opened from the app flow

This keeps monetization aligned with the user’s mental model: pay to unlock *more journeys*.

Note: In a production setup, the API key should be managed via secrets/env config rather than committed to source.

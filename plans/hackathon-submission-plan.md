# RevenueCat Shipyard 2026 — Submission Plan

## Hackathon Info
- **Contest:** RevenueCat Shipyard: Creator Contest
- **Devpost:** https://revenuecat-shipyard-2026.devpost.com
- **Deadline:** February 12, 2026, 11:45 PM EST
- **Prize:** $20,000 (per creator brief winner)
- **Creator Brief:** Gabby Beckford (@packslight) — Goal-to-action motivational app

## Gabby's Brief
> Upbeat motivational platform for "dreaming to doing." Goal-tracking app converting dreams into daily micro-actions with gamification. Target: Smart, adventurous women seeking life upgrades and travel experiences.

**Required features:** Daily micro-actions, challenges, streaks/wins tracking, gamified progress moments, celebratory elements.

---

## Current App State: Quest Planner

### What Works
- Campaign flow: Select → Intro → Briefing → Home → Acts → Quests
- 4-act "Solo Trip" campaign with quests & segment tracking
- Chat-based briefing with personality-driven plan generation
- Streak engine & habit calendar
- Stamp collection system with reveal animations & haptics
- Act unlock flow with celebratory UX
- Reusable UI component library (20+ components)
- Full design token system

### What's Broken (BLOCKERS)
1. **`react-native-purchases` SDK not installed** — app crashes if purchase code runs
2. **`DEV_CLEAR_CACHE = true`** in CampaignContext.js — wipes all data on every launch
3. **RevenueCat config uses wrong IDs** — product IDs say `lmwfy_monthly/yearly`, entitlement says `HelloWorld Pro`
4. **PurchasesProvider not in App.js** — purchase context not available
5. **No TestFlight build exists** — submission requires TestFlight link
6. **No demo video** — required (2-3 min, on YouTube/Vimeo)
7. **No devpost submission draft** — nothing started

---

## Submission Requirements Checklist

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | **TestFlight link** | ❌ Not built | Need production build + TestFlight upload |
| 2 | **Demo video (2-3 min)** | ❌ Not recorded | Must show: onboarding → core loop → monetization |
| 3 | **Written proposal (1-2 pages)** | ❌ Not written | Problem, solution, monetization strategy, roadmap |
| 4 | **Technical documentation** | ❌ Not written | Architecture overview + RevenueCat integration |
| 5 | **Developer bio** | ❌ Not written | Background, portfolio links, motivation |
| 6 | **RevenueCat SDK integrated** | ❌ Broken | SDK missing, wrong product IDs |
| 7 | **App runs on device** | ⚠️ Partial | Campaign flow works, but purchase code will crash |

---

## Phase 1: Fix App Blockers (Day 1 — Feb 8-9)

### 1.1 Install RevenueCat SDK
- [ ] Run `npm install react-native-purchases` in quest-planner
- [ ] Verify import works in PurchasesContext.js
- [ ] Run `eas build --profile development --platform ios` to get native module

### 1.2 Fix RevenueCat Configuration
- [ ] Update `src/purchases/config.js`:
  - API key: verify or create new one for quest-planner in RevenueCat dashboard
  - Entitlement: rename from `HelloWorld Pro` → `premium` (or match dashboard)
  - Product IDs: create quest-planner products in App Store Connect OR rename existing
- [ ] Set up RevenueCat dashboard for quest-planner:
  - Create app with bundle ID `com.swapnilsawant.questplanner`
  - Add P8 key
  - Create entitlement + offering + packages
  - Link products from App Store Connect

### 1.3 Wire Up PurchasesProvider
- [ ] Wrap `<CampaignProvider>` with `<PurchasesProvider>` in App.js
- [ ] Decide where paywall triggers (e.g., after Act 1 complete, or on "premium" quests)
- [ ] Test paywall screen loads without crashing

### 1.4 Fix Development Flags
- [ ] Set `DEV_CLEAR_CACHE = false` in CampaignContext.js
- [ ] Remove or conditionalize any MOCK_HABITS data in HabitsContext.js
- [ ] Verify data persists across app restarts

### 1.5 Smoke Test on Device
- [ ] Full flow: Campaign Select → Briefing → Home → Quest completion → Stamp reveal
- [ ] Paywall screen shows (even if sandbox products not yet configured)
- [ ] No crashes during normal usage

---

## Phase 2: App Store Connect & RevenueCat Setup (Day 2 — Feb 9-10)

### 2.1 App Store Connect
- [ ] Create app listing for Quest Planner (bundle ID: `com.swapnilsawant.questplanner`)
- [ ] Create subscription group (e.g., "Quest Planner Premium")
- [ ] Create products:
  - Monthly: `questplanner_monthly` — $4.99/mo
  - Yearly: `questplanner_yearly` — $29.99/yr
- [ ] Configure free trial (7-day)
- [ ] Set up sandbox test account

### 2.2 RevenueCat Dashboard
- [ ] Create project for Quest Planner
- [ ] Add iOS app with correct bundle ID
- [ ] Upload P8 key (can reuse from lmwfy if same Apple dev account)
- [ ] Create entitlement "premium"
- [ ] Create offering "default" with monthly + yearly packages
- [ ] Test connection validates

### 2.3 Update App Config
- [ ] Update `src/purchases/config.js` with real quest-planner product IDs
- [ ] Update entitlement ID
- [ ] Verify API key is correct

### 2.4 Test Purchases in Sandbox
- [ ] Open paywall → see real products with pricing
- [ ] Complete sandbox purchase → premium unlocks
- [ ] Restore purchases works

---

## Phase 3: TestFlight Build (Day 2-3 — Feb 10)

### 3.1 Pre-Build Checks
- [ ] `DEV_CLEAR_CACHE = false` confirmed
- [ ] No console.log spam left
- [ ] App version set to 1.0.0
- [ ] app.json metadata correct (name, slug, icon, splash)

### 3.2 Build & Upload
- [ ] Run `eas build --profile production --platform ios`
- [ ] Submit to TestFlight: `eas submit --platform ios`
- [ ] Wait for Apple processing (usually 15-30 min)

### 3.3 TestFlight Testing
- [ ] Install on device via TestFlight
- [ ] Full end-to-end test
- [ ] Generate TestFlight public link for judges
- [ ] Note: judges need free, unrestricted access

---

## Phase 4: Demo Video (Day 3 — Feb 10-11)

### 4.1 Script the Demo (2-3 minutes)
```
0:00-0:15  Hook: "Quest Planner turns your big dreams into daily micro-actions"
0:15-0:45  Campaign selection + briefing flow (shows personalization)
0:45-1:15  Campaign home — 4 acts, quest cards, progress tracking
1:15-1:45  Quest completion — tap to increment, animations, haptics
1:45-2:00  Act completion — stamp reveal, collection animation
2:00-2:20  Next act unlock flow
2:20-2:40  Paywall / monetization (premium features)
2:40-3:00  Wrap-up: roadmap, Gabby alignment
```

### 4.2 Record
- [ ] Screen record on iPhone (Settings → Control Center → Screen Recording)
- [ ] Record each segment separately if needed
- [ ] Include device frame if possible (simulator or post-processing)

### 4.3 Edit & Upload
- [ ] Edit video (iMovie or similar)
- [ ] Add captions/text overlays for key points
- [ ] Upload to YouTube (unlisted)
- [ ] Get video URL for submission

---

## Phase 5: Written Submission (Day 3-4 — Feb 11)

### 5.1 Written Proposal (1-2 pages)

**Problem Statement:**
Ambitious women save travel dreams and life goals but struggle to convert them into daily action. Existing habit trackers feel generic — they lack narrative, personality, and the celebratory moments that make progress feel meaningful.

**Solution Overview:**
Quest Planner gamifies goal achievement through narrative "campaigns." Users start with a solo travel campaign, go through a personalized briefing that adapts to their comfort level, then tackle daily micro-actions organized into themed acts. Completing acts earns memory stamps — personalized collectibles that celebrate progress.

**Monetization Strategy:**
- Freemium model with RevenueCat subscriptions
- Free: 1 campaign (Solo Trip, Act 1)
- Premium ($4.99/mo or $29.99/yr): All campaigns, all acts, unlimited quests, advanced stamps
- 7-day free trial
- Target: $3-5/mo price point matching audience price sensitivity

**Post-Hackathon Roadmap:**
- Additional campaigns (Career Pivot, Fitness Journey, Creative Project)
- Community challenges
- Creator-branded campaigns (partnership with Gabby)
- Social sharing of stamp collections
- Push notification reminders

### 5.2 Technical Documentation

**Architecture:**
- React Native (Expo SDK 54) — iOS first
- State machine navigation (reducer pattern)
- Context API for state (Campaign, Streaks, Purchases)
- AsyncStorage for local persistence
- RevenueCat SDK for subscriptions

**RevenueCat Integration:**
- PurchasesProvider wraps app
- Premium entitlement gates advanced campaigns/acts
- PaywallScreen displays offerings fetched from RevenueCat
- Sandbox-tested purchase + restore flows

### 5.3 Developer Bio
- [ ] Write bio: background, portfolio, motivation for building this
- [ ] Link to GitHub, portfolio, App Store (if lmwfy is live)

---

## Phase 6: Devpost Submission (Day 4 — Feb 12)

### 6.1 Create Submission
- [ ] Go to https://revenuecat-shipyard-2026.devpost.com/submissions/new
- [ ] Select creator: Gabby Beckford
- [ ] Fill in all fields:
  - Project name: Quest Planner
  - Tagline: "Turn your dreams into daily micro-actions"
  - Description: paste written proposal
  - Demo video: YouTube URL
  - TestFlight link
  - Technical documentation
  - Developer bio
  - Screenshots (3-5 from key screens)

### 6.2 Final Review
- [ ] TestFlight link works (judges can install)
- [ ] Video plays correctly
- [ ] All text proofread
- [ ] Submit before 11:45 PM EST

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Apple review delays TestFlight | HIGH | Build early (Day 2), TestFlight doesn't need App Store review |
| RevenueCat sandbox issues | MEDIUM | Test early, can show paywall UI even without live purchases |
| App crashes during judging | HIGH | Extensive device testing, remove all dev flags |
| Product IDs not approved in time | MEDIUM | Can use sandbox; judges understand MVP state |
| Demo video takes too long | LOW | Script it first, record in segments, simple editing |

---

## Timeline Summary

| Day | Date | Focus |
|-----|------|-------|
| Day 1 | Feb 8-9 (Sat-Sun) | Fix blockers, install RevenueCat, test locally |
| Day 2 | Feb 9-10 (Sun-Mon) | App Store Connect setup, RevenueCat dashboard, TestFlight build |
| Day 3 | Feb 10-11 (Mon-Tue) | Device testing, demo video recording |
| Day 4 | Feb 11-12 (Tue-Wed) | Written submission, devpost form, final review |
| DEADLINE | Feb 12 11:45 PM EST | Submit on devpost |

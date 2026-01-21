# Streaks-Style Habit Tracker Demo (React Native) — Product Plan

## 1. Problem Statement (2–3 sentences)
Many habit tracker apps feel either too complex or too “game-like,” which creates friction for users who just want a fast daily check-in and motivation through streaks. We need a **clean, Streaks-style iOS-first UX** (ported via React Native) that makes it effortless to **mark habits done** and **see streak progress** without accounts or backend. This demo app exists to validate UX, data model, and core streak logic before investing in full production features.

## 2. Solution Overview (1 paragraph)
Build a React Native demo habit tracker that centers on a **Today checklist** (one-tap completion), a **Habit Detail** screen with a **calendar/chain view** and streak stats, and a lightweight **Insights** tab. The product is **local-first** (no login, no cloud) and optimized for speed: open → check → streak updates. Development is phased so each milestone can be demonstrated end-to-end with clear success criteria.

## 3. Success Metrics (SMART)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Primary KPI: Core loop completion | A user can add a habit, mark it done for today, and see streak update in < 60 seconds | Manual test script + screen recording |
| Reliability: Data persistence | Completion state persists across app restarts 100% of the time in manual testing | Restart tests (10 runs) |
| Performance: Home load time | Today screen interactive in < 1.0s on a mid-range iPhone simulator profile | Profiler / manual timing |
| UX clarity: First-run comprehension | 4/5 test users can explain “streak” and how to mark habits done without help | 5-user hallway test |

## 4. Scope Definition

**In Scope (Must Have - P0)**
- Bottom tab navigation: Today / Habits / Insights / Settings
- Habit CRUD: create, edit, delete
- Daily completion tracking (local storage)
- Streak calculations (current + longest) and “don’t break the chain” calendar view
- Basic empty states and onboarding copy

**Should Have (P1)**
- Scheduling (weekdays vs daily) and “only show due today”
- Grouping (Morning/Afternoon/Evening) or simple tags
- Minimal analytics logging (local)

**Out of Scope (Explicitly Not Doing)**
- Accounts/login, cloud sync, multi-device
- Social/community, leaderboards
- Complex gamification (coins, avatars, rewards economy)
- Deep coaching content, AI features, subscriptions/paywalls

## 5. Technical Approach
- **React Native app** with a simple state architecture (e.g., store + selectors) and a date-safe habit log model.
- **Local-first persistence** using a lightweight storage layer (e.g., device storage) with deterministic serialization.
- **Core domain model**
  - `Habit` (id, name, schedule, createdAt, archived)
  - `CompletionLog` (habitId, dateKey, status)
  - Derived stats: current streak, longest streak, completion rate
- **Key constraints**
  - Dates handled with explicit **local date keys** (e.g., YYYY-MM-DD) to avoid timezone edge cases.
  - Efficient rendering for 12–30 habits and up to 12 months of history.

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Streak logic bugs (timezones, missed days) | High | Use explicit local date keys, add test checklist for midnight/timezone scenarios |
| UI feels “generic” vs premium habit apps | Med | Prioritize spacing/typography, micro-interactions, and a distinctive calendar/chain view |
| Scope creep (turning into full productivity suite) | High | Keep P0 strictly: Today + Streaks + Detail; defer scheduling/insights polish to later phases |
| Performance issues with calendar rendering | Med | Limit calendar to month paging; precompute minimal derived data; avoid heavy re-renders |

---

# Delivery Plan in Phases

## Phase 0 — UX Skeleton (Clickable Demo)
**Goal:** Validate navigation and primary screens with mock data.

**Scope**
- Tabs: Today / Habits / Insights / Settings
- Static mock habits list
- Today checklist interaction (visual toggle only)
- Habit Detail route exists (placeholder)
- Empty states for “no habits”

### Success Criteria Checklist (Phase 0)
## Navigation Requirements
- [ ] App opens to **Today** by default
- [ ] Bottom tabs switch correctly between all 4 sections
- [ ] Navigation back/forward works without breaking state

## Today Screen Requirements
- [ ] Today shows a clear list of habits (mock data)
- [ ] User can toggle a habit “Done” and see immediate visual change
- [ ] Today header shows “X / Y completed” based on toggles
- [ ] Empty state appears when there are no habits (mock empty mode)

## Habit Detail Requirements
- [ ] Tapping a habit navigates to Habit Detail placeholder
- [ ] Habit Detail shows the habit name and a placeholder calendar area

---

## Phase 1 — Core Tracking + Local Persistence (MVP)
**Goal:** Real habit CRUD + saved daily completion.

**Scope**
- Add/Edit/Delete habit (name; optional notes)
- Local persistence for habits + today completions
- Today list reflects saved data across restarts
- “Completed count” is accurate

### Success Criteria Checklist (Phase 1)
## Habit CRUD Requirements
- [ ] User can add a habit and it appears on Today immediately
- [ ] User can edit a habit name and it updates across Today/Habits/Detail
- [ ] User can delete a habit and it disappears everywhere
- [ ] Empty state appears after deleting the last habit

## Persistence Requirements
- [ ] Today completion states persist after force-closing and reopening the app
- [ ] Habits list persists after app restart
- [ ] No duplicate habit IDs or duplicate entries after multiple add/edit operations

## Today Accuracy Requirements
- [ ] “X / Y completed” updates correctly on each toggle
- [ ] A habit can only be completed once per local day (no double counting)

---

## Phase 2 — Streak Engine + Habit Detail Calendar (Signature Feature)
**Goal:** Deliver “Streaks clone” value: streak stats + chain/calendar view.

**Scope**
- Streak calculations:
  - current streak
  - longest streak
  - last completed date
- Habit Detail:
  - month calendar / dot grid / chain heatmap
  - ability to toggle today from detail
  - stats row (streaks + completion rate optional)

### Success Criteria Checklist (Phase 2)
## Streak Logic Requirements
- [ ] Current streak increments when user completes habit on consecutive due days
- [ ] Missing a due day resets current streak on the next completion
- [ ] Longest streak updates correctly when current streak exceeds it
- [ ] Streak results match calendar history for at least 30 consecutive days (manual test)

## Calendar/Chain View Requirements
- [ ] Habit Detail shows a month view with completed days clearly marked
- [ ] User can page months (current + previous at minimum)
- [ ] Today’s completion toggle in detail updates Today screen immediately
- [ ] Calendar renders consistently across common iPhone sizes (small/standard/large)

## Performance Requirements
- [ ] Habit Detail loads in < 500ms with 12 months of history for a habit (demo threshold)
- [ ] Scrolling Today remains smooth with 25 habits

---

## Phase 3 — Scheduling + “Due Today” Behavior (Real-World Fit)
**Goal:** Make the app useful beyond daily-only habits.

**Scope**
- Scheduling modes:
  - Daily
  - Specific weekdays (Mon–Sun toggles)
- Today shows only habits due today
- Streak rules respect schedule (non-due days do not break streak)
- Optional grouping tags (Morning/Afternoon/Evening)

### Success Criteria Checklist (Phase 3)
## Scheduling Requirements
- [ ] User can set a habit to specific weekdays
- [ ] Today only displays habits due today
- [ ] Changing schedule updates behavior predictably for future dates

## Schedule-Aware Streak Requirements
- [ ] Non-due days do not count as misses and do not break streak
- [ ] Missing a due day breaks streak (and is reflected in calendar)
- [ ] Calendar indicates due vs non-due days (simple visual differentiation)

## UX Clarity Requirements
- [ ] Habit row clearly indicates schedule (e.g., “Mon/Wed/Fri” or “Daily”)
- [ ] If a habit is not due today, it is not accidentally completable from Today

---

## Phase 4 — Insights (Retention Layer)
**Goal:** Provide simple, motivating feedback without complexity.

**Scope**
- Insights tab:
  - weekly consistency (%)
  - top habits by completion
  - missed habits (this week)
- Gentle nudges (non-notification): “1 day away from best streak”
- Optional streak milestones

### Success Criteria Checklist (Phase 4)
## Insights Accuracy Requirements
- [ ] Weekly consistency reflects last 7 local days correctly
- [ ] Top habits list matches completion counts
- [ ] Missed habits list matches due-but-not-completed days

## UX Requirements
- [ ] Insights are readable in < 10 seconds (no dense dashboards)
- [ ] Nudge messages appear only when relevant (no spam)
- [ ] Insights load in < 1.0s for typical usage (<= 30 habits, 90 days data)

---

## Phase 5 — Demo Polish + Ship-Ready Packaging
**Goal:** Make the demo feel like a premium iOS app.

**Scope**
- Onboarding (<= 3 screens)
- Light/dark mode, accessible typography
- Haptics/micro-animations (minimal)
- Edge-case QA: midnight rollover, timezone change, DST
- Export/import JSON (optional, demo-friendly)

### Success Criteria Checklist (Phase 5)
## Visual & Accessibility Requirements
- [ ] Light and dark mode both look polished and consistent
- [ ] Supports Dynamic Type without layout breaking on primary screens
- [ ] Primary actions are reachable and clear (one-hand usability)

## Reliability Requirements
- [ ] Midnight rollover does not corrupt “today” completion state
- [ ] Timezone change does not duplicate or lose completions
- [ ] No critical crashes across a 15-minute demo run

## Demo Readiness Requirements
- [ ] First-run onboarding completes in < 30 seconds
- [ ] A full demo script can be completed without manual data seeding
- [ ] App state can be reset easily for repeated demos (clear data option)

---

# Evidence Log (fill as you verify)

| Requirement | Verified | Evidence |
|-------------|----------|----------|
| Phase 1 persistence across restarts |  |  |
| Phase 2 streak logic correctness |  |  |
| Phase 3 schedule-aware streaks |  |  |
| Phase 4 insights accuracy |  |  |
| Phase 5 midnight/timezone edge cases |  |  |

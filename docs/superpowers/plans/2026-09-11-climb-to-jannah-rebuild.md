# Climb to Jannah Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy standalone HTML prototype with a secure, premium, mobile-first React + TypeScript + Firebase PWA for private Muslim productivity tracking.

**Architecture:** Build a Vite React SPA with feature-scoped modules, Firebase Authentication and Firestore repositories, Firestore offline persistence, a shared design system, route-level loading/error handling, and PWA support. Keep `main` untouched until the rebuild passes CI and manual verification; use Firebase Hosting for production.

**Tech Stack:** React, TypeScript, Vite, React Router, Firebase Auth/Firestore, `react-hook-form`, `zod`, `@hookform/resolvers`, `i18next`, `react-i18next`, `date-fns`, `adhan`, `recharts`, `lucide-react`, `vite-plugin-pwa`, Vitest, React Testing Library, Firebase Emulator Suite, Playwright, ESLint.

**Spec:** `docs/superpowers/specs/2026-09-11-climb-to-jannah-rebuild-design.md`

## Global Constraints

- Public Muslim productivity app.
- Personal data private by default.
- Optional sharing can be added later, always opt-in.
- Never claim to measure Allah's reward, sin weight, Jannah distance, or spiritual rank.
- **Consistency Score** means routine adherence only.
- Self-Control uses clean streaks, slips, recovery, and trends; no shame score or arbitrary religious penalty.
- Launch English-first with centralized UI strings/i18n-ready structure.
- No legacy tracking-data migration.
- Support Google sign-in, email/password registration/login, password reset, and email verification for email/password registrations.
- Firebase Hosting is the production target.
- PWA app shell loads offline after first successful load.
- Firestore writes use offline persistence where supported and sync after reconnect.
- Mobile-first, keyboard-friendly, sufficient contrast, visible focus, and reduced-motion support.
- No fixed-interval Firestore polling.
- Before merge to `main`: lint, type-check, unit tests, Firestore rule tests, production build, core E2E flows, and responsive checks pass.
- No public leaderboards, competitive spiritual rankings, public default feeds, chat/forums, paid subscriptions, complex admin dashboards, or AI religious rulings in v1.

---

## File Structure

```text
.
├── .github/workflows/ci.yml
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
├── public/icons/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── RouteErrorBoundary.tsx
│   │   ├── providers/AppProviders.tsx
│   │   └── styles/{tokens.css,global.css}
│   ├── components/
│   │   ├── layout/{AppShell.tsx,BottomNav.tsx,Sidebar.tsx,TopBar.tsx}
│   │   └── ui/{Button.tsx,Card.tsx,EmptyState.tsx,Field.tsx,StatusBanner.tsx}
│   ├── lib/{firebase.ts,i18n.ts,dates.ts,network.ts}
│   ├── locales/en/common.json
│   ├── features/
│   │   ├── auth/
│   │   ├── data/
│   │   ├── security/
│   │   ├── dashboard/
│   │   ├── routines/
│   │   ├── salah/
│   │   ├── quran/
│   │   ├── selfControl/
│   │   ├── journal/
│   │   ├── progress/
│   │   ├── settings/
│   │   └── support/
│   └── test/{setup.ts,firebaseEmulator.ts}
└── e2e/{auth.spec.ts,core-flow.spec.ts}
```

Each feature owns its types, repository, domain helpers, UI, and tests.

---

### Task 1: Bootstrap React/TypeScript and CI

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/app/App.tsx`, `src/test/setup.ts`, `.github/workflows/ci.yml`. Keep legacy HTML temporarily.

**Produces:** runnable Vite app and commands `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`.

- [ ] **Step 1: Add failing smoke test**

`src/app/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders product name', () => {
  render(<App />);
  expect(screen.getByText('Climb to Jannah')).toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm pre-scaffold failure**

```bash
npm test -- --run src/app/App.test.tsx
```

Expected: command/test fails because the new app is not configured.

- [ ] **Step 3: Scaffold without overwriting approved docs**

```bash
rm -rf /tmp/climbtojannah-vite
npm create vite@latest /tmp/climbtojannah-vite -- --template react-ts
cp -R /tmp/climbtojannah-vite/package.json /tmp/climbtojannah-vite/index.html /tmp/climbtojannah-vite/src /tmp/climbtojannah-vite/public /tmp/climbtojannah-vite/tsconfig*.json /tmp/climbtojannah-vite/vite.config.ts /tmp/climbtojannah-vite/eslint.config.js .
npm install
npm install firebase react-router-dom react-hook-form zod @hookform/resolvers i18next react-i18next date-fns adhan recharts lucide-react
npm install -D vite-plugin-pwa vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test firebase-tools @firebase/rules-unit-testing
```

Set scripts:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "typecheck": "tsc -b --pretty false",
  "test": "vitest",
  "test:rules": "firebase emulators:exec --only firestore \"vitest run src/features/security/firestore.rules.test.ts\"",
  "test:e2e": "playwright test",
  "preview": "vite preview"
}
```

- [ ] **Step 4: Configure Vitest and minimal app**

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`src/app/App.tsx`:

```tsx
export function App() {
  return <main><h1>Climb to Jannah</h1></main>;
}
```

Set Vitest `environment: 'jsdom'` and `setupFiles: './src/test/setup.ts'` in `vite.config.ts`.

- [ ] **Step 5: Add GitHub Actions**

```yaml
name: ci
on:
  push:
    branches: [upgrade/react-rebuild, main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --run
      - run: npm run build
```

- [ ] **Step 6: Verify and commit**

```bash
npm run lint && npm run typecheck && npm test -- --run && npm run build
git add package.json package-lock.json index.html src vite.config.ts tsconfig*.json eslint.config.js .github/workflows/ci.yml
git commit -m "build: bootstrap React TypeScript application"
```

---

### Task 2: Design system, responsive shell, routing, i18n

**Files:** Create `src/app/router.tsx`, `src/app/providers/AppProviders.tsx`, `src/app/styles/tokens.css`, `src/app/styles/global.css`, `src/lib/i18n.ts`, `src/locales/en/common.json`, layout components, and `Button`, `Card`, `StatusBanner`.

**Produces:** `AppShell`, route placeholders, shared visual tokens, and `t()` translation access.

- [ ] **Step 1: Write shell test**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

test('shows core navigation', () => {
  render(<MemoryRouter><AppShell /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /routine/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /progress/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm failure**

```bash
npm test -- --run src/components/layout/AppShell.test.tsx
```

- [ ] **Step 3: Add premium tokens**

```css
:root {
  --color-bg: #0b1512;
  --color-surface: #12201b;
  --color-surface-soft: #f3ecdc;
  --color-emerald: #1f8a70;
  --color-emerald-strong: #146451;
  --color-gold: #c5a253;
  --color-text: #f8f5ed;
  --color-text-dark: #17201d;
  --color-muted: #a7b2ac;
  --color-danger: #d56a6a;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --shadow-card: 0 18px 50px rgb(0 0 0 / .18);
  --content-max: 1180px;
}
```

- [ ] **Step 4: Centralize English copy**

```json
{
  "brand": {"name":"Climb to Jannah","tagline":"Grow with purpose. Strive with sincerity."},
  "nav": {"dashboard":"Dashboard","routine":"Routine","salah":"Salah","quran":"Qur’an","selfControl":"Self-Control","journal":"Journal","progress":"Progress","settings":"Settings"}
}
```

Initialize `i18next` with `fallbackLng: 'en'`.

- [ ] **Step 5: Add accessibility defaults**

`global.css` includes `:focus-visible`, 44px minimum primary tap targets, semantic heading scale, and `@media (prefers-reduced-motion: reduce)` that disables nonessential transitions/animations.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- --run src/components/layout/AppShell.test.tsx && npm run typecheck && npm run build
git add src/app src/components src/lib/i18n.ts src/locales
git commit -m "feat: add premium responsive application shell"
```

---

### Task 3: Firebase initialization and authentication

**Files:** Create `src/lib/firebase.ts`, `src/features/auth/{authService.ts,AuthProvider.tsx,RequireAuth.tsx,LoginPage.tsx,RegisterPage.tsx,ForgotPasswordPage.tsx,VerifyEmailPage.tsx,authService.test.ts}`, `.env.example`; modify providers/router.

**Produces:** `useAuth(): { user: User | null; loading: boolean }`, `signInWithGoogle`, `signInWithEmail`, `registerWithEmail`, `sendPasswordReset`, `logout`.

- [ ] **Step 1: Write Firebase-auth contract test with mocked modular APIs**

```ts
vi.mock('firebase/auth', async () => ({
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'u1' } }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendEmailVerification: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}));

test('Google sign-in returns user', async () => {
  const { signInWithGoogle } = await import('./authService');
  expect((await signInWithGoogle()).uid).toBe('u1');
});
```

- [ ] **Step 2: Confirm failure**

```bash
npm test -- --run src/features/auth/authService.test.ts
```

- [ ] **Step 3: Initialize Firebase exactly once**

`firebase.ts` reads `VITE_FIREBASE_*`, initializes Auth and Firestore, and enables persistent local cache where supported. Do not duplicate initialization in features.

- [ ] **Step 4: Implement email and Google flows**

Email registration updates display name and sends verification. Zod validates email and minimum 8-character password; registration validates matching confirmation. Map Firebase error codes to readable field/general errors.

- [ ] **Step 5: Add auth guard without undefined UI dependencies**

```tsx
if (loading) {
  return <main aria-busy="true"><p role="status">Loading account…</p></main>;
}
if (!user) return <Navigate to="/login" replace />;
return <Outlet />;
```

- [ ] **Step 6: Verify and commit**

```bash
npm test -- --run src/features/auth && npm run typecheck && npm run build
git add src/lib/firebase.ts src/features/auth src/app .env.example
git commit -m "feat: add Firebase authentication flows"
```

---

### Task 4: Firestore schema and UID-scoped security

**Files:** Create `src/features/data/{schema.ts,paths.ts}`, `firestore.rules`, `firestore.indexes.json`, `firebase.json`, `src/features/security/firestore.rules.test.ts`, `src/test/firebaseEmulator.ts`.

**Produces:** domain types and UID-based path helpers.

- [ ] **Step 1: Define core types**

```ts
export type GoalCategory = 'deen' | 'dunya';
export interface RoutineGoal {
  id: string;
  title: string;
  category: GoalCategory;
  enabled: boolean;
  order: number;
  scheduleDays: number[];
  createdAt: string;
  updatedAt: string;
}
export interface DailyCompletion {
  dateKey: string;
  completedGoalIds: string[];
  updatedAt: string;
}
```

Also define `UserProfile`, `PrayerDay`, `QuranEntry`, `SelfControlHabit`, `SelfControlEvent`, `JournalEntry`, `WeeklyReflection`, `ReminderSettings`.

- [ ] **Step 2: Write rules tests first**

```ts
await assertSucceeds(setDoc(doc(ownerDb, 'users/u1/routines/r1'), validRoutine));
await assertFails(getDoc(doc(otherDb, 'users/u1/routines/r1')));
await assertFails(setDoc(doc(otherDb, 'users/u1/routines/r2'), validRoutine));
```

Also assert unauthenticated read/write failure.

- [ ] **Step 3: Confirm rules tests fail before rules implementation**

```bash
npm run test:rules
```

- [ ] **Step 4: Implement ownership rules**

```text
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  match /{document=**} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

Add field/type validation for routine/settings writes.

- [ ] **Step 5: Verify and commit**

```bash
npm run test:rules
git add firestore.rules firestore.indexes.json firebase.json src/features/data src/features/security src/test/firebaseEmulator.ts
git commit -m "feat: add private Firestore schema and rules"
```

---

### Task 5: Daily Routine and transparent Consistency Score

**Files:** Create `src/features/routines/{routineRepository.ts,routineService.ts,useRoutines.ts,RoutinePage.tsx,GoalEditor.tsx,consistency.ts,consistency.test.ts,defaultGoals.ts}` and `src/lib/dates.ts`.

**Produces:** `calculateDailyConsistency(scheduledGoalIds, completedGoalIds): number`, date-key utilities, routine CRUD/completion APIs.

- [ ] **Step 1: Test score semantics**

```ts
test('uses completion percentage only', () => {
  expect(calculateDailyConsistency(['a','b','c','d'], ['a','c','d'])).toBe(75);
});

test('zero scheduled goals returns zero', () => {
  expect(calculateDailyConsistency([], [])).toBe(0);
});
```

- [ ] **Step 2: Confirm failure, then implement**

```ts
export function calculateDailyConsistency(scheduled: string[], completed: string[]) {
  if (scheduled.length === 0) return 0;
  const completedSet = new Set(completed);
  return Math.round((scheduled.filter(id => completedSet.has(id)).length / scheduled.length) * 100);
}
```

- [ ] **Step 3: Add editable defaults**

Default routine labels: Fajr, Dhuhr, Asr, Maghrib, Isha, Qur’an reading, morning/evening adhkar, reflection. They have no reward-point values and can be hidden, renamed, reordered, or removed.

- [ ] **Step 4: Implement CRUD and date-keyed completion records**

Use `setDoc(..., { merge: true })`; no interval polling. Show pending-sync text when offline.

- [ ] **Step 5: Test add/edit/reorder/hide/delete/completion**

Mock repository functions and verify only the intended goal/completion changes.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- --run src/features/routines && npm run typecheck
git add src/features/routines src/lib/dates.ts
git commit -m "feat: add customizable routine tracking"
```

---

### Task 6: Salah and prayer-time configuration

**Files:** Create `src/features/salah/{salahTypes.ts,prayerTimes.ts,prayerTimes.test.ts,salahRepository.ts,SalahPage.tsx,PrayerSetup.tsx}`.

**Produces:** `getPrayerTimes(input)`, manual completion for `fajr | dhuhr | asr | maghrib | isha`.

- [ ] **Step 1: Test prayer-time adapter output**

Assert configured input returns all five prayer names and chronologically sorted times.

- [ ] **Step 2: Isolate `adhan` behind `prayerTimes.ts`**

Support explicit calculation-method and Asr-madhab selection. UI never calls `adhan` directly.

- [ ] **Step 3: Implement privacy-respecting location setup**

Offer explicit device-location permission or manual latitude/longitude. Manual salah completion works even without configured location.

- [ ] **Step 4: Store one `PrayerDay` per date**

Time passage never auto-completes a prayer.

- [ ] **Step 5: Test manual completion and commit**

```bash
npm test -- --run src/features/salah && npm run typecheck
git add src/features/salah
git commit -m "feat: add prayer times and manual salah tracking"
```

---

### Task 7: Qur’an activity tracking

**Files:** Create `src/features/quran/{quranTypes.ts,quranRepository.ts,QuranPage.tsx,QuranEntryForm.tsx,quranSummary.ts,quranSummary.test.ts}`.

**Produces:** activity kinds `reading | memorization | revision | tafsir`; optional pages/ayah/minutes metrics.

- [ ] **Step 1: Write summary test**

```ts
test('summarizes mixed activity', () => {
  const value = summarizeQuranDay([
    { kind: 'reading', pages: 4, minutes: 12 },
    { kind: 'revision', ayah: 8, minutes: 10 },
  ]);
  expect(value).toMatchObject({ sessions: 2, pages: 4, ayah: 8, minutes: 22 });
});
```

- [ ] **Step 2: Implement pure summary + validated persistence**

Reject negative quantities and submissions with no metric and no note.

- [ ] **Step 3: Build simple today surface plus detailed history**

Quick-add first; history shows activity kind and metrics.

- [ ] **Step 4: Verify and commit**

```bash
npm test -- --run src/features/quran && npm run typecheck
git add src/features/quran
git commit -m "feat: add Quran activity tracking"
```

---

### Task 8: Self-Control tracking and recovery

**Files:** Create `src/features/selfControl/{selfControlTypes.ts,selfControlRepository.ts,recovery.ts,recovery.test.ts,SelfControlPage.tsx,SlipDialog.tsx}`.

**Produces:** `cleanDaysSince(startedAt,lastSlipAt,now): number`; events `slip | recovery_note`.

- [ ] **Step 1: Test calendar-day streak logic**

```ts
test('streak restarts after latest slip', () => {
  expect(cleanDaysSince('2026-09-01', '2026-09-08', new Date('2026-09-11T12:00:00Z'))).toBe(3);
});
```

- [ ] **Step 2: Implement using date utilities, not raw millisecond division**

Timezone/day-boundary behavior must remain stable across DST changes.

- [ ] **Step 3: Implement neutral slip/recovery UX**

Use copy such as `Recorded. Start again from here.` Never use “sin points”, “failure score”, or punitive values.

- [ ] **Step 4: Add optional private recovery note and event trend**

- [ ] **Step 5: Verify and commit**

```bash
npm test -- --run src/features/selfControl && npm run typecheck
git add src/features/selfControl
git commit -m "feat: add self-control recovery tracking"
```

---

### Task 9: Private journal and weekly reflection

**Files:** Create `src/features/journal/{journalRepository.ts,JournalPage.tsx,JournalEditor.tsx,JournalPreview.tsx,WeeklyReflection.tsx,prompts.ts,JournalPage.test.tsx}`.

**Produces:** private text journal and one reflection document per ISO week.

- [ ] **Step 1: Test safe text rendering**

```tsx
test('does not execute journal HTML', () => {
  render(<JournalPreview body={'<img src=x onerror="alert(1)">'} />);
  expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument();
  expect(document.querySelector('img')).toBeNull();
});
```

- [ ] **Step 2: Implement normal React text rendering only**

Do not use `dangerouslySetInnerHTML`.

- [ ] **Step 3: Add guided prompts**

```ts
[
  { id: 'went-well', text: 'What went well today?' },
  { id: 'improve', text: 'What would you like to improve tomorrow?' },
  { id: 'gratitude', text: 'What are you grateful for today?' },
]
```

- [ ] **Step 4: Add weekly fields**

`wins`, `struggle`, `nextFocus`, `gratitude`.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- --run src/features/journal && npm run typecheck
git add src/features/journal
git commit -m "feat: add private journal and reflections"
```

---

### Task 10: Dashboard and Progress analytics

**Files:** Create `src/features/dashboard/{DashboardPage.tsx,useDashboardSummary.ts,MotivationCard.tsx}` and `src/features/progress/{ProgressPage.tsx,analytics.ts,analytics.test.ts,ConsistencyChart.tsx,InsightList.tsx}`.

**Produces:** balanced today summary, weekly/monthly charts, factual trend insights.

- [ ] **Step 1: Test weekly/rolling analytics and zero-data cases**

Analytics functions are pure and receive daily aggregates rather than querying Firestore themselves.

- [ ] **Step 2: Build mobile dashboard order**

```text
Greeting + date
Salah status
Today's routine progress
Qur’an summary
Consistency context
Reflection/motivation
Quick actions
```

- [ ] **Step 3: Build accessible Progress charts**

Use `recharts`; every chart includes a textual summary so color/graphics are not the only information channel.

- [ ] **Step 4: Curate motivation safely**

Do not reuse legacy reward-point copy. Store a small static set of clearly sourced references plus original reflection copy; never present generated prose as Qur’an/Hadith text.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- --run src/features/dashboard src/features/progress && npm run build
git add src/features/dashboard src/features/progress
git commit -m "feat: add dashboard and progress insights"
```

---

### Task 11: Settings, reminders, offline/PWA state

**Files:** Create `src/features/settings/{settingsRepository.ts,SettingsPage.tsx,ReminderSettings.tsx,reminders.ts,reminders.test.ts}`, `src/lib/network.ts`, `public/icons/icon-192.png`, `public/icons/icon-512.png`; modify `vite.config.ts` and `StatusBanner.tsx`.

**Produces:** reminder preferences, quiet hours, in-app reminder engine, capability-gated browser notifications, installable PWA.

- [ ] **Step 1: Test quiet hours crossing midnight**

```ts
test('quiet hours can cross midnight', () => {
  expect(isWithinQuietHours('23:30', { start: '22:00', end: '06:00' })).toBe(true);
  expect(isWithinQuietHours('12:00', { start: '22:00', end: '06:00' })).toBe(false);
});
```

- [ ] **Step 2: Implement reminder decision logic**

A reminder is eligible only when enabled, outside quiet hours, an item is due, and that due-window reminder has not already been shown. Schedule the next in-app reminder with a single timeout calculated from the next due event; do not poll Firestore on an interval.

- [ ] **Step 3: Browser notification capability rules**

Request permission only after the user explicitly enables browser notifications. If unsupported/denied, continue with in-app reminders. V1 does not promise notification delivery while the browser/PWA is fully suspended because there is no paid server-side push scheduler in this scope.

- [ ] **Step 4: Configure PWA**

```ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Climb to Jannah',
    short_name: 'Climb',
    description: 'Grow with purpose. Strive with sincerity.',
    theme_color: '#0b1512',
    background_color: '#0b1512',
    display: 'standalone',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
})
```

Generate and commit valid 192×192 and 512×512 brand icons before referencing them.

- [ ] **Step 5: Implement network/sync banner**

Use browser `online/offline` events. Copy: `Offline — changes will sync when connection returns.` Distinguish this from hard sync errors.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- --run src/features/settings && npm run build
git add src/features/settings src/lib/network.ts src/components/ui/StatusBanner.tsx vite.config.ts public/icons
git commit -m "feat: add PWA and reminder preferences"
```

---

### Task 12: Support, error states, accessibility, performance

**Files:** Create `src/features/support/SupportPage.tsx`, `src/components/ui/{EmptyState.tsx,Field.tsx}`, `src/app/RouteErrorBoundary.tsx`, `src/app/accessibility.test.tsx`; modify feature routes.

**Produces:** explicit loading/empty/offline/error states and real help content.

- [ ] **Step 1: Test labels, focusable controls, and route-error recovery action**

Use RTL queries by role/label rather than class names.

- [ ] **Step 2: Add lazy loading**

Use `React.lazy` for `progress`, `journal`, `settings`, and `support` routes with a consistent accessible fallback.

- [ ] **Step 3: Replace placeholder Help actions**

Support sections: account access, privacy, offline/sync behavior, consistency-score meaning, salah tracking, notifications. Use the public repository GitHub Issues page as the concrete bug-report/support link; label it clearly as public so users do not post private journal/account data.

- [ ] **Step 4: Verify quality gates and commit**

```bash
npm run lint && npm run typecheck && npm test -- --run && npm run build
git add src
git commit -m "feat: harden accessibility and error handling"
```

---

### Task 13: E2E, Firebase Hosting, legacy cutover

**Files:** Create `playwright.config.ts`, `e2e/auth.spec.ts`, `e2e/core-flow.spec.ts`; modify `firebase.json`, `.github/workflows/ci.yml`, `README.md`; delete legacy HTML, obsolete `motivation.json`, and legacy `CNAME` after parity verification.

**Produces:** production SPA routing and verified replacement of legacy pages.

- [ ] **Step 1: Add E2E core flow**

Test emulator-backed login and this sequence: create a custom routine goal → complete it → manually mark a salah → add Qur’an activity → record self-control slip → save journal entry → open Progress.

Example interaction:

```ts
await page.getByRole('link', { name: /routine/i }).click();
await page.getByRole('button', { name: /add goal/i }).click();
await page.getByLabel(/goal title/i).fill('Study 45 minutes');
await page.getByRole('button', { name: /save/i }).click();
await expect(page.getByText('Study 45 minutes')).toBeVisible();
```

- [ ] **Step 2: Configure Firebase Hosting SPA fallback**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

Keep Firestore rules/emulator config in the same `firebase.json`.

- [ ] **Step 3: Run full suite before deletion**

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run test:rules
npm run build
npm run test:e2e
```

- [ ] **Step 4: Manual production-build verification**

```bash
npm run build && npm run preview -- --host 0.0.0.0
```

Check mobile/tablet/desktop, login/logout, first-load then offline reload, offline queued write then reconnect, keyboard navigation, and reduced-motion.

- [ ] **Step 5: Remove legacy delivery files only after parity passes**

Delete `Deed-journal.html`, `Help-&-Support.html`, `daily-goals.html`, `progress-tracking.html`, old `motivation.json` when no longer referenced, and `CNAME`. Keep the new Vite `index.html`.

- [ ] **Step 6: Document setup/deployment**

README covers `VITE_FIREBASE_*`, Firebase emulator, tests, build, Firebase Hosting deployment, and the intentional clean-reset/no-migration policy.

- [ ] **Step 7: Verify clean install and commit**

```bash
npm ci && npm run lint && npm run typecheck && npm test -- --run && npm run test:rules && npm run build && npm run test:e2e
git add -A
git commit -m "feat: complete Climb to Jannah React PWA rebuild"
```

---

### Task 14: Final branch review and merge readiness

**Files:** Review only; any fixes go to their owning feature files.

**Produces:** PR-ready `upgrade/react-rebuild` branch.

- [ ] **Step 1: Review diff**

```bash
git diff --stat main...upgrade/react-rebuild
git diff main...upgrade/react-rebuild -- firestore.rules firebase.json package.json
```

Check for accidental secrets, unrelated files, and obsolete spiritual-scoring semantics.

- [ ] **Step 2: Search prohibited legacy copy**

```bash
grep -RniE "distance to jannah|sin points|bad deed points|earn \+[0-9]+ points" src public README.md || true
```

Expected: no religious reward/punishment represented as numerical scoring.

- [ ] **Step 3: Run final suite**

```bash
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run test:rules
npm run build
npm run test:e2e
```

Expected: all pass.

- [ ] **Step 4: Create PR**

Title: `Rebuild Climb to Jannah as premium React PWA`

Body summarizes product changes, privacy/security model, tests, deployment notes, and states that legacy user tracking data is intentionally not migrated.

- [ ] **Step 5: Merge only after successful CI/review**

Never force-push `main`; deploy the verified `main` build to Firebase Hosting after merge.

---

## Self-Review Result

- Spec coverage: auth, routines, salah, Qur’an, self-control, journal, dashboard, progress, settings, reminders, PWA/offline, privacy/security, accessibility, support, CI, deployment, and legacy cutover each have an implementation task.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation placeholders remain.
- Interface consistency: auth loading UI no longer references an undefined component; date utilities are explicitly created; journal preview is explicitly created; data/security directories are represented in the file map.
- Scope: social/community features remain future-ready but intentionally outside v1.

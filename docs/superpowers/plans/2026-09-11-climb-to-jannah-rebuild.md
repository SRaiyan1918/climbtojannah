# Climb to Jannah Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy standalone HTML prototype with a secure, premium, mobile-first React + TypeScript + Firebase PWA for private Muslim productivity tracking.

**Architecture:** Build a Vite React SPA with feature-scoped modules, Firebase Authentication and Firestore repositories, Firestore offline persistence, a shared design system, route-level error/loading handling, and PWA support. Keep `main` untouched until the new branch passes CI and product verification; use Firebase Hosting for final SPA/PWA deployment.

**Tech Stack:** React, TypeScript, Vite, React Router, Firebase Auth/Firestore, `react-hook-form`, `zod`, `@hookform/resolvers`, `i18next`, `react-i18next`, `date-fns`, `adhan`, `recharts`, `lucide-react`, `vite-plugin-pwa`, Vitest, React Testing Library, Firebase Emulator Suite, Playwright, ESLint.

**Spec:** `docs/superpowers/specs/2026-09-11-climb-to-jannah-rebuild-design.md`

## Global Constraints

- Public Muslim productivity app.
- Personal data private by default.
- Optional sharing can be added later, always opt-in.
- The app must never claim to measure Allah's reward, sin weight, Jannah distance, or spiritual rank.
- Completing routines may improve a **Consistency Score**; the score represents adherence to user-defined routines only.
- Self-Control tracking uses clean streaks, slips, recovery, and trends; no shame score or arbitrary religious penalty value.
- Launch English-first with centralized UI strings/i18n-ready structure.
- No migration of legacy tracking data is required.
- Support Google sign-in, email/password registration/login, password reset, and email verification where appropriate.
- Firebase Hosting is the production hosting target.
- PWA app shell must load offline after first successful load.
- Firestore writes must use offline persistence where supported and sync when connectivity returns.
- Mobile-first, accessible, keyboard-friendly, reduced-motion aware.
- No unnecessary fixed-interval Firestore refetch loops.
- Before merge to `main`: type-check, lint, production build, unit tests, core integration flows, and responsive checks must pass.
- Do not add public leaderboards, competitive spiritual rankings, public default feeds, chat/forums, paid subscriptions, complex admin dashboards, or AI religious rulings in v1.

---

## Planned File Structure

```text
.
├── .github/workflows/ci.yml
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers/AppProviders.tsx
│   │   └── styles/{tokens.css,global.css}
│   ├── components/
│   │   ├── layout/{AppShell.tsx,BottomNav.tsx,Sidebar.tsx,TopBar.tsx}
│   │   └── ui/{Button.tsx,Card.tsx,EmptyState.tsx,Field.tsx,Modal.tsx,ProgressRing.tsx,StatusBanner.tsx}
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── i18n.ts
│   │   ├── dates.ts
│   │   ├── network.ts
│   │   └── validation.ts
│   ├── locales/en/common.json
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── routines/
│   │   ├── salah/
│   │   ├── quran/
│   │   ├── selfControl/
│   │   ├── journal/
│   │   ├── progress/
│   │   ├── settings/
│   │   └── support/
│   └── test/
│       ├── setup.ts
│       └── firebaseEmulator.ts
└── e2e/
    ├── auth.spec.ts
    └── core-flow.spec.ts
```

Each feature owns its types, repository, hooks, UI, and tests so domain logic can change without coupling unrelated pages.

---

### Task 1: Bootstrap the React/TypeScript application and CI baseline

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/test/setup.ts`
- Create: `.github/workflows/ci.yml`
- Keep temporarily: legacy `*.html` files until Task 13 cutover

**Interfaces:**
- Produces: a runnable Vite React app, `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`.

- [ ] **Step 1: Write the smoke test**

Create `src/app/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the product name', () => {
  render(<App />);
  expect(screen.getByText('Climb to Jannah')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the smoke test and confirm it fails before app scaffolding exists**

Run:

```bash
npm test -- --run src/app/App.test.tsx
```

Expected: failure because the React/Vitest app is not yet configured.

- [ ] **Step 3: Scaffold the app and install dependencies**

Use a temporary directory so the approved spec files on the branch are not overwritten:

```bash
npm create vite@latest /tmp/climbtojannah-vite -- --template react-ts
cp -R /tmp/climbtojannah-vite/{package.json,index.html,src,public,tsconfig*.json,vite.config.ts,eslint.config.js} .
npm install
npm install firebase react-router-dom react-hook-form zod @hookform/resolvers i18next react-i18next date-fns adhan recharts lucide-react
npm install -D vite-plugin-pwa vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test firebase-tools @firebase/rules-unit-testing
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "typecheck": "tsc -b --pretty false",
    "test": "vitest",
    "test:rules": "firebase emulators:exec --only firestore \"vitest run src/features/security/firestore.rules.test.ts\"",
    "test:e2e": "playwright test",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 4: Configure Vitest and render the minimal app**

`src/app/App.tsx`:

```tsx
export function App() {
  return <main><h1>Climb to Jannah</h1></main>;
}
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Add to `vite.config.ts` test config using `defineConfig` with `environment: 'jsdom'` and `setupFiles: './src/test/setup.ts'`.

- [ ] **Step 5: Add CI**

`.github/workflows/ci.yml`:

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

- [ ] **Step 6: Verify baseline**

Run:

```bash
npm run lint && npm run typecheck && npm test -- --run && npm run build
```

Expected: all commands pass.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json index.html src vite.config.ts tsconfig*.json eslint.config.js .github/workflows/ci.yml
git commit -m "build: bootstrap React TypeScript application"
```

---

### Task 2: Build the design system, responsive shell, routing, and i18n foundation

**Files:**
- Create: `src/app/router.tsx`
- Create: `src/app/providers/AppProviders.tsx`
- Create: `src/app/styles/tokens.css`
- Create: `src/app/styles/global.css`
- Create: `src/lib/i18n.ts`
- Create: `src/locales/en/common.json`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/components/layout/TopBar.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/StatusBanner.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Produces: `AppShell`, route placeholders, `Button`, `Card`, `StatusBanner`, `t()` translation access.

- [ ] **Step 1: Write responsive shell tests**

`src/components/layout/AppShell.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

test('shows core navigation destinations', () => {
  render(<MemoryRouter><AppShell /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /routine/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /progress/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test and verify failure**

```bash
npm test -- --run src/components/layout/AppShell.test.tsx
```

Expected: fail because shell does not exist.

- [ ] **Step 3: Create design tokens**

`src/app/styles/tokens.css` must define named tokens only; components consume tokens rather than hard-coded theme colors:

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
  --shadow-card: 0 18px 50px rgb(0 0 0 / 0.18);
  --content-max: 1180px;
}
```

- [ ] **Step 4: Create route shell and centralized strings**

`src/locales/en/common.json` begins with:

```json
{
  "brand": {
    "name": "Climb to Jannah",
    "tagline": "Grow with purpose. Strive with sincerity."
  },
  "nav": {
    "dashboard": "Dashboard",
    "routine": "Routine",
    "salah": "Salah",
    "quran": "Qur’an",
    "selfControl": "Self-Control",
    "journal": "Journal",
    "progress": "Progress",
    "settings": "Settings"
  }
}
```

Create `i18n.ts` with English resources and `fallbackLng: 'en'`.

- [ ] **Step 5: Add accessibility defaults**

`global.css` must include visible `:focus-visible`, `prefers-reduced-motion`, minimum tap targets, and semantic typography rules.

- [ ] **Step 6: Run tests and build**

```bash
npm test -- --run src/components/layout/AppShell.test.tsx && npm run typecheck && npm run build
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add src/app src/components src/lib/i18n.ts src/locales

git commit -m "feat: add premium responsive application shell"
```

---

### Task 3: Configure Firebase once and implement authentication

**Files:**
- Create: `src/lib/firebase.ts`
- Create: `src/features/auth/authService.ts`
- Create: `src/features/auth/AuthProvider.tsx`
- Create: `src/features/auth/RequireAuth.tsx`
- Create: `src/features/auth/LoginPage.tsx`
- Create: `src/features/auth/RegisterPage.tsx`
- Create: `src/features/auth/ForgotPasswordPage.tsx`
- Create: `src/features/auth/VerifyEmailPage.tsx`
- Create: `src/features/auth/authService.test.ts`
- Modify: `src/app/providers/AppProviders.tsx`
- Modify: `src/app/router.tsx`
- Create: `.env.example`

**Interfaces:**
- Produces: `useAuth(): { user: User | null; loading: boolean }`.
- Produces: `signInWithGoogle()`, `signInWithEmail(email,password)`, `registerWithEmail(email,password,displayName)`, `sendPasswordReset(email)`, `logout()`.

- [ ] **Step 1: Write auth-service contract tests with Firebase APIs mocked**

Example:

```ts
import { describe, expect, test, vi } from 'vitest';

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

test('Google sign-in returns the authenticated user', async () => {
  const { signInWithGoogle } = await import('./authService');
  const user = await signInWithGoogle();
  expect(user.uid).toBe('u1');
});
```

- [ ] **Step 2: Run test to confirm failure**

```bash
npm test -- --run src/features/auth/authService.test.ts
```

Expected: fail because service is missing.

- [ ] **Step 3: Centralize Firebase initialization**

`src/lib/firebase.ts` reads only `VITE_FIREBASE_*` variables, initializes `app`, `auth`, and Firestore once, and enables persistent local cache when supported. Firebase client config is not treated as a server secret; Firestore rules remain the authorization boundary.

- [ ] **Step 4: Implement auth service and provider**

Use Firebase modular Auth APIs. On email registration: update display name, send verification email, then return the user. Map Firebase error codes to human-readable form errors instead of showing raw codes.

- [ ] **Step 5: Implement protected routing**

`RequireAuth` behavior:

```tsx
if (loading) return <FullPageLoader />;
if (!user) return <Navigate to="/login" replace />;
return <Outlet />;
```

- [ ] **Step 6: Add accessible forms**

Use `react-hook-form` + `zod`; email schema uses `z.string().email()`, password minimum is 8 characters, and registration confirms password equality.

- [ ] **Step 7: Verify**

```bash
npm test -- --run src/features/auth && npm run typecheck && npm run build
```

Expected: pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/firebase.ts src/features/auth src/app .env.example
git commit -m "feat: add secure Firebase authentication flows"
```

---

### Task 4: Define Firestore domain model and UID-scoped security rules

**Files:**
- Create: `src/features/data/schema.ts`
- Create: `src/features/data/paths.ts`
- Create: `firestore.rules`
- Create: `firestore.indexes.json`
- Create: `firebase.json`
- Create: `src/features/security/firestore.rules.test.ts`
- Create: `src/test/firebaseEmulator.ts`

**Interfaces:**
- Produces path helpers such as `userDoc(uid)`, `routineCollection(uid)`, `dailyCompletionDoc(uid,dateKey)`, `journalCollection(uid)`.
- Produces domain types: `UserProfile`, `RoutineGoal`, `DailyCompletion`, `PrayerDay`, `QuranEntry`, `SelfControlHabit`, `SelfControlEvent`, `JournalEntry`, `WeeklyReflection`, `ReminderSettings`.

- [ ] **Step 1: Define explicit schema types**

Key shape examples:

```ts
export type GoalCategory = 'deen' | 'dunya';

export interface RoutineGoal {
  id: string;
  title: string;
  category: GoalCategory;
  enabled: boolean;
  order: number;
  scheduleDays: number[]; // 0 Sunday ... 6 Saturday
  createdAt: string;
  updatedAt: string;
}

export interface DailyCompletion {
  dateKey: string; // yyyy-MM-dd in user's selected timezone
  completedGoalIds: string[];
  updatedAt: string;
}
```

- [ ] **Step 2: Write security-rule tests first**

Tests must prove:

```ts
await assertSucceeds(setDoc(doc(ownerDb, 'users/u1/routines/r1'), validRoutine));
await assertFails(getDoc(doc(otherDb, 'users/u1/routines/r1')));
await assertFails(setDoc(doc(otherDb, 'users/u1/routines/r2'), validRoutine));
```

Unauthenticated reads/writes also fail.

- [ ] **Step 3: Run rules tests and confirm failure**

```bash
npm run test:rules
```

Expected: fail before rules are implemented.

- [ ] **Step 4: Implement UID-scoped rules**

Base rule pattern:

```text
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;

  match /{document=**} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

Add field/type validation for high-risk settings and routine writes rather than relying only on ownership.

- [ ] **Step 5: Verify rule isolation**

```bash
npm run test:rules
```

Expected: all ownership/unauthenticated tests pass.

- [ ] **Step 6: Commit**

```bash
git add firestore.rules firestore.indexes.json firebase.json src/features/data src/features/security src/test/firebaseEmulator.ts
git commit -m "feat: add private Firestore schema and security rules"
```

---

### Task 5: Implement Daily Routine and transparent Consistency Score

**Files:**
- Create: `src/features/routines/routineRepository.ts`
- Create: `src/features/routines/routineService.ts`
- Create: `src/features/routines/useRoutines.ts`
- Create: `src/features/routines/RoutinePage.tsx`
- Create: `src/features/routines/GoalEditor.tsx`
- Create: `src/features/routines/consistency.ts`
- Create: `src/features/routines/consistency.test.ts`
- Create: `src/features/routines/defaultGoals.ts`

**Interfaces:**
- Produces: `calculateDailyConsistency(scheduledGoalIds: string[], completedGoalIds: string[]): number` returning integer 0–100.
- Produces: `calculateRollingConsistency(days: {scheduled:number;completed:number}[]): number`.
- Produces CRUD repository for goals and date-keyed completion records.

- [ ] **Step 1: Write scoring tests**

```ts
import { expect, test } from 'vitest';
import { calculateDailyConsistency } from './consistency';

test('returns transparent completion percentage', () => {
  expect(calculateDailyConsistency(['a','b','c','d'], ['a','c','d'])).toBe(75);
});

test('returns zero when no scheduled goals exist', () => {
  expect(calculateDailyConsistency([], [])).toBe(0);
});
```

- [ ] **Step 2: Run test and verify failure**

```bash
npm test -- --run src/features/routines/consistency.test.ts
```

- [ ] **Step 3: Implement scoring without arbitrary spiritual values**

```ts
export function calculateDailyConsistency(scheduled: string[], completed: string[]) {
  if (scheduled.length === 0) return 0;
  const completedSet = new Set(completed);
  const count = scheduled.filter(id => completedSet.has(id)).length;
  return Math.round((count / scheduled.length) * 100);
}
```

- [ ] **Step 4: Seed editable Islamic defaults**

Defaults should be routine labels only, not claims about reward values. Initial set: five daily prayers as routine-linked defaults, Qur’an reading, morning/evening adhkar, and one reflection item. Users can hide, reorder, rename, delete, or add deen/dunya items.

- [ ] **Step 5: Implement Firestore repository and optimistic/offline-safe UI**

Completion toggles write the date document with `setDoc(..., { merge: true })`; UI shows a small pending-sync state when `navigator.onLine === false`.

- [ ] **Step 6: Add CRUD interaction tests**

Use mocked repository methods to verify add/edit/reorder/hide/delete and completion toggles.

- [ ] **Step 7: Verify**

```bash
npm test -- --run src/features/routines && npm run typecheck
```

- [ ] **Step 8: Commit**

```bash
git add src/features/routines
git commit -m "feat: add customizable routine and consistency tracking"
```

---

### Task 6: Implement Salah tracking and prayer-time configuration

**Files:**
- Create: `src/features/salah/salahTypes.ts`
- Create: `src/features/salah/prayerTimes.ts`
- Create: `src/features/salah/prayerTimes.test.ts`
- Create: `src/features/salah/salahRepository.ts`
- Create: `src/features/salah/SalahPage.tsx`
- Create: `src/features/salah/PrayerSetup.tsx`

**Interfaces:**
- Produces: `getPrayerTimes(input: PrayerCalculationInput): PrayerTimesResult`.
- Consumes: user-selected latitude/longitude, calculation method, madhab, timezone/date.
- Produces manual completion state for `fajr | dhuhr | asr | maghrib | isha`.

- [ ] **Step 1: Write calculation mapping tests**

Test that a configured date/location returns all five required prayer keys and times sorted chronologically.

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- --run src/features/salah/prayerTimes.test.ts
```

- [ ] **Step 3: Implement `adhan` adapter**

Keep `adhan` usage isolated in `prayerTimes.ts`; UI code must not call the library directly. Support explicit calculation method selection and Asr madhab selection. Do not infer prayer completion from time passage.

- [ ] **Step 4: Implement setup UX**

Offer two location paths:

```text
Use device location (explicit browser permission)
Enter coordinates manually
```

Do not require device geolocation to use manual salah tracking.

- [ ] **Step 5: Implement manual completion storage**

Use one `PrayerDay` document per date key with boolean fields for the five prayers and `updatedAt`.

- [ ] **Step 6: Add UI tests**

Verify marking Fajr complete changes only Fajr and that time passage itself does not mark any prayer complete.

- [ ] **Step 7: Commit**

```bash
git add src/features/salah
git commit -m "feat: add prayer times and manual salah tracking"
```

---

### Task 7: Implement Qur’an activity tracking

**Files:**
- Create: `src/features/quran/quranTypes.ts`
- Create: `src/features/quran/quranRepository.ts`
- Create: `src/features/quran/QuranPage.tsx`
- Create: `src/features/quran/QuranEntryForm.tsx`
- Create: `src/features/quran/quranSummary.ts`
- Create: `src/features/quran/quranSummary.test.ts`

**Interfaces:**
- Supports activity kinds: `reading | memorization | revision | tafsir`.
- Quantities: optional `pages`, `ayah`, `minutes`; users may record only the fields relevant to the activity.
- Produces `summarizeQuranDay(entries): { sessions, pages, ayah, minutes, kinds }`.

- [ ] **Step 1: Write summary tests**

```ts
test('sums mixed Qur’an activity without double counting', () => {
  const summary = summarizeQuranDay([
    { kind: 'reading', pages: 4, minutes: 12 },
    { kind: 'revision', ayah: 8, minutes: 10 },
  ]);
  expect(summary).toMatchObject({ sessions: 2, pages: 4, ayah: 8, minutes: 22 });
});
```

- [ ] **Step 2: Run test and verify failure**

- [ ] **Step 3: Implement repository + validated form**

Require at least one positive quantity or a short note; reject negative quantities and blank no-op submissions.

- [ ] **Step 4: Implement simple surface + detailed history**

Default page shows today’s total and quick-add; history expands into activity type and metrics.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- --run src/features/quran && npm run typecheck
git add src/features/quran
git commit -m "feat: add Qur’an reading and study tracking"
```

---

### Task 8: Implement Self-Control tracking without shame scoring

**Files:**
- Create: `src/features/selfControl/selfControlTypes.ts`
- Create: `src/features/selfControl/selfControlRepository.ts`
- Create: `src/features/selfControl/recovery.ts`
- Create: `src/features/selfControl/recovery.test.ts`
- Create: `src/features/selfControl/SelfControlPage.tsx`
- Create: `src/features/selfControl/SlipDialog.tsx`

**Interfaces:**
- Habit has `startedAt`, optional `lastSlipAt`, `enabled`, `title`.
- Event type is `slip | recovery_note`.
- Produces `cleanDaysSince(startedAt,lastSlipAt,now): number`.

- [ ] **Step 1: Write recovery math tests**

```ts
test('clean streak restarts after the latest slip', () => {
  expect(cleanDaysSince('2026-09-01', '2026-09-08', new Date('2026-09-11T12:00:00Z'))).toBe(3);
});
```

- [ ] **Step 2: Run and verify failure**

- [ ] **Step 3: Implement clean-streak calculation using calendar-day boundaries**

Use date utilities rather than raw millisecond division so DST/timezone changes do not create off-by-one results.

- [ ] **Step 4: Implement slip recording UX**

Copy rules: neutral language such as “Recorded. Start again from here.” Never display “sin points”, “failure score”, or punitive numerical values.

- [ ] **Step 5: Add recovery note flow and trend history**

Recovery note is optional and private; chart uses event dates only.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- --run src/features/selfControl && npm run typecheck
git add src/features/selfControl
git commit -m "feat: add private self-control and recovery tracking"
```

---

### Task 9: Implement private journal and weekly reflection

**Files:**
- Create: `src/features/journal/journalRepository.ts`
- Create: `src/features/journal/JournalPage.tsx`
- Create: `src/features/journal/JournalEditor.tsx`
- Create: `src/features/journal/WeeklyReflection.tsx`
- Create: `src/features/journal/prompts.ts`
- Create: `src/features/journal/JournalPage.test.tsx`

**Interfaces:**
- Journal entry: `{ id, dateKey, title, body, promptId?, createdAt, updatedAt }`.
- Weekly reflection: `{ weekKey, wins, struggle, nextFocus, gratitude, updatedAt }`.

- [ ] **Step 1: Write journal rendering safety test**

```tsx
test('renders journal text as text, not executable HTML', async () => {
  render(<JournalPreview body={'<img src=x onerror="alert(1)">'} />);
  expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument();
  expect(document.querySelector('img')).toBeNull();
});
```

- [ ] **Step 2: Run and verify failure**

- [ ] **Step 3: Implement text-only safe rendering and repository**

Do not use `dangerouslySetInnerHTML`. Store raw user text and render via normal React text nodes.

- [ ] **Step 4: Add guided prompts**

Initial prompts:

```ts
[
  { id: 'went-well', text: 'What went well today?' },
  { id: 'improve', text: 'What would you like to improve tomorrow?' },
  { id: 'gratitude', text: 'What are you grateful for today?' },
]
```

- [ ] **Step 5: Implement weekly reflection form**

Use four explicit fields (`wins`, `struggle`, `nextFocus`, `gratitude`) and one document per ISO week key.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- --run src/features/journal && npm run typecheck
git add src/features/journal
git commit -m "feat: add private journal and weekly reflections"
```

---

### Task 10: Build Dashboard and Progress analytics

**Files:**
- Create: `src/features/dashboard/DashboardPage.tsx`
- Create: `src/features/dashboard/useDashboardSummary.ts`
- Create: `src/features/dashboard/MotivationCard.tsx`
- Create: `src/features/progress/ProgressPage.tsx`
- Create: `src/features/progress/analytics.ts`
- Create: `src/features/progress/analytics.test.ts`
- Create: `src/features/progress/ConsistencyChart.tsx`
- Create: `src/features/progress/InsightList.tsx`

**Interfaces:**
- Dashboard summary combines already-owned feature repositories; it does not duplicate Firestore storage.
- Produces insights from factual trends only, e.g. “You completed more scheduled goals this week than last week.”

- [ ] **Step 1: Write analytics tests**

Test weekly completion percentage, seven-day rolling score, and week-over-week trend direction with zero-data cases.

- [ ] **Step 2: Run and verify failure**

- [ ] **Step 3: Implement pure analytics functions**

Pure functions accept arrays of daily aggregates and return numbers/labels; no Firestore calls inside analytics helpers.

- [ ] **Step 4: Build balanced dashboard**

Dashboard order on mobile:

```text
Greeting + date
Salah status
Today's routine progress
Qur’an summary
Consistency context
Reflection/motivation
Quick actions
```

Avoid displaying all historical charts on the dashboard.

- [ ] **Step 5: Build Progress page**

Use `recharts` for weekly/monthly visualizations with accessible text summaries below charts. Charts must not be the only way information is conveyed.

- [ ] **Step 6: Add motivation content safely**

Do not reuse legacy “reward point” messaging. Use a small curated static set with source references and original reflection text; do not present generated text as Qur’an or Hadith.

- [ ] **Step 7: Verify and commit**

```bash
npm test -- --run src/features/dashboard src/features/progress && npm run build
git add src/features/dashboard src/features/progress
git commit -m "feat: add balanced dashboard and progress insights"
```

---

### Task 11: Implement settings, reminder preferences, network state, and PWA

**Files:**
- Create: `src/features/settings/settingsRepository.ts`
- Create: `src/features/settings/SettingsPage.tsx`
- Create: `src/features/settings/ReminderSettings.tsx`
- Create: `src/lib/network.ts`
- Create: `src/components/ui/StatusBanner.tsx`
- Modify: `vite.config.ts`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`
- Create: `src/features/settings/reminders.ts`
- Create: `src/features/settings/reminders.test.ts`

**Interfaces:**
- Reminder settings store enabled reminder types and quiet-hours start/end.
- Browser notifications are capability-checked; unsupported platforms receive in-app reminders only.
- PWA uses generated service worker; Firestore handles queued data writes.

- [ ] **Step 1: Write quiet-hours tests**

```ts
test('handles quiet hours crossing midnight', () => {
  expect(isWithinQuietHours('23:30', { start: '22:00', end: '06:00' })).toBe(true);
  expect(isWithinQuietHours('12:00', { start: '22:00', end: '06:00' })).toBe(false);
});
```

- [ ] **Step 2: Run and verify failure**

- [ ] **Step 3: Implement reminder decision logic**

Reminder eligibility must check: reminder enabled, not inside quiet hours, app has relevant due item, and same reminder has not already been shown for that due window.

- [ ] **Step 4: Implement notification capability behavior**

If `Notification` is unavailable or permission is denied, show in-app reminders only. Never claim background delivery is guaranteed. Request notification permission only after a user explicitly enables browser notifications in Settings.

- [ ] **Step 5: Configure PWA**

`vite-plugin-pwa` config must include:

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

Use real generated project icons before commit; do not commit missing icon references.

- [ ] **Step 6: Implement network/sync banner**

Network state listens to browser `online/offline` events. UI wording distinguishes `Offline — changes will sync when connection returns` from hard errors.

- [ ] **Step 7: Verify and commit**

```bash
npm test -- --run src/features/settings && npm run build
git add src/features/settings src/lib/network.ts src/components/ui/StatusBanner.tsx vite.config.ts public/icons
git commit -m "feat: add PWA offline states and smart reminder preferences"
```

---

### Task 12: Finish Settings, Help, error states, accessibility, and performance

**Files:**
- Create: `src/features/support/SupportPage.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/Field.tsx`
- Create: `src/app/RouteErrorBoundary.tsx`
- Modify: all feature routes for loading/empty/error states
- Create: `src/app/accessibility.test.tsx`

**Interfaces:**
- Every primary route has explicit loading, empty, network failure, and permission error presentation.
- Support page contains real product guidance; no placeholder “Start Chat” buttons.

- [ ] **Step 1: Write navigation/accessibility tests**

Test that primary controls have accessible names, forms connect labels to inputs, keyboard focus remains visible, and route errors show a recovery action.

- [ ] **Step 2: Run and verify failure**

- [ ] **Step 3: Add route-level lazy loading**

Use `React.lazy` for noncritical routes (`progress`, `journal`, `settings`, `support`) and a consistent route fallback.

- [ ] **Step 4: Implement Help & Support content**

Include sections for account access, offline behavior, consistency-score meaning, privacy, salah tracking, and notification limitations. Provide a GitHub issue link only if it is intended as public support; otherwise provide a simple support contact text configured centrally.

- [ ] **Step 5: Run quality checks**

```bash
npm run lint && npm run typecheck && npm test -- --run && npm run build
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: harden UX accessibility and error handling"
```

---

### Task 13: Add end-to-end tests, Firebase Hosting, and legacy cutover

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/auth.spec.ts`
- Create: `e2e/core-flow.spec.ts`
- Modify: `firebase.json`
- Modify: `.github/workflows/ci.yml`
- Delete after parity verification: `Deed-journal.html`
- Delete after parity verification: `Help-&-Support.html`
- Delete after parity verification: `daily-goals.html`
- Delete after parity verification: `progress-tracking.html`
- Delete after parity verification: legacy `motivation.json` if curated content no longer depends on it
- Delete: legacy `CNAME` during Firebase Hosting cutover
- Replace: legacy root `index.html` with Vite entry already created in Task 1
- Update: `README.md`

**Interfaces:**
- Produces production SPA routing and documented deployment commands.

- [ ] **Step 1: Write core E2E tests**

`e2e/core-flow.spec.ts` should cover a test/emulator account:

```ts
await page.goto('/login');
// authenticate against emulator helper
await page.getByRole('link', { name: /routine/i }).click();
await page.getByRole('button', { name: /add goal/i }).click();
await page.getByLabel(/goal title/i).fill('Study 45 minutes');
await page.getByRole('button', { name: /save/i }).click();
await expect(page.getByText('Study 45 minutes')).toBeVisible();
```

Also cover manual salah completion, Qur’an entry, self-control slip recording, and journal save.

- [ ] **Step 2: Configure SPA hosting**

`firebase.json` hosting section:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

Keep Firestore emulator/rules configuration in the same file.

- [ ] **Step 3: Run complete local verification**

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run test:rules
npm run build
npm run test:e2e
```

Expected: all pass.

- [ ] **Step 4: Verify production build manually**

Run:

```bash
npm run build && npm run preview -- --host 0.0.0.0
```

Check common mobile, tablet, and desktop widths; login/logout; offline reload after first load; queued write reconciliation after reconnect; keyboard navigation; reduced-motion preference.

- [ ] **Step 5: Remove legacy files only after parity checks pass**

Delete legacy HTML/CNAME files on `upgrade/react-rebuild`; do not alter `main` yet.

- [ ] **Step 6: Update README**

Document local setup, required `VITE_FIREBASE_*` variables, Firebase emulator commands, CI commands, build, and Firebase Hosting deployment.

- [ ] **Step 7: Final verification after deletions**

```bash
npm ci && npm run lint && npm run typecheck && npm test -- --run && npm run test:rules && npm run build
```

Expected: pass from clean install.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: complete Climb to Jannah React PWA rebuild"
```

---

### Task 14: Final branch review and merge readiness

**Files:**
- Review only; fixes go to the relevant feature files.

**Interfaces:**
- Produces a branch that is safe to open as a PR against `main`.

- [ ] **Step 1: Compare branch against main**

```bash
git diff --stat main...upgrade/react-rebuild
git diff main...upgrade/react-rebuild -- firestore.rules firebase.json package.json
```

Confirm no accidental secrets, no unrelated files, and no surviving legacy spiritual-score language.

- [ ] **Step 2: Search prohibited legacy wording**

```bash
grep -RniE "distance to jannah|sin points|bad deed points|earn \+[0-9]+ points" src public README.md || true
```

Expected: no product copy that presents religious reward/punishment as a numerical metric.

- [ ] **Step 3: Run final full suite**

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

- [ ] **Step 4: Create pull request**

PR title:

```text
Rebuild Climb to Jannah as premium React PWA
```

PR body must summarize product changes, security model, test results, deployment/cutover notes, and state clearly that legacy user tracking data is intentionally not migrated.

- [ ] **Step 5: Merge only after review**

Do not force-push `main`. Merge after code review and successful CI; then deploy the verified `main` build to Firebase Hosting.

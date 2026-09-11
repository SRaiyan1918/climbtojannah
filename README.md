# Climb to Jannah

A private-by-default Muslim productivity PWA for routines, manual Salah tracking, Qur’an activity, self-control recovery, journaling and factual progress insights.

## Product principles

- Consistency Score means adherence to user-defined routines only. It does **not** measure Allah’s reward, sin weight, Jannah distance, or spiritual rank.
- Salah completion is always manual. Prayer times never auto-complete prayers.
- Self-Control uses recovery language, not shame points.
- Journal and tracking data are stored under the signed-in user and are private by default.
- This rebuild intentionally starts with a clean data model; legacy tracking data is not migrated.

## Local setup

Use Node 22+ and npm 11.6+.

```bash
npm install
npm run dev
```

Create `.env.local` with your Firebase web-app values:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Never commit private credentials or service-account keys. Firebase web configuration is used by the browser and access control is enforced by Authentication plus Firestore Security Rules.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run test:rules
npm run build
```

For browser E2E tests, install Chromium once:

```bash
npx playwright install chromium
npm run test:e2e
```

`test:e2e` starts Firebase Auth and Firestore emulators around the Playwright run. The Vite test server uses the demo project only and never connects E2E writes to production Firebase.

## PWA and offline behavior

The app is installable through the generated web manifest and service worker. After a successful first load, the app shell is cached. Firestore offline persistence is enabled where the browser supports it; queued writes can sync after connectivity returns. Browser notifications require explicit user permission and v1 does not promise delivery while the browser/PWA is fully suspended.

## Firebase Hosting

Build and deploy the SPA:

```bash
npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

`firebase.json` routes all Hosting paths to `dist/index.html` so React Router deep links work.

## CI

GitHub Actions verifies dependency installation, lint, TypeScript, unit tests, Firestore rule tests, production build, and the emulator-backed Chromium core flow before merge.
